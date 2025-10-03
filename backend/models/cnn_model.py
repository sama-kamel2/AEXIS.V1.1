import torch
import torch.nn as nn
import torch.nn.functional as F

class ExoplanetCNN(nn.Module):
    def __init__(self, input_length=1000, num_layers=3):
        super(ExoplanetCNN, self).__init__()

        self.num_layers = num_layers

        self.conv1 = nn.Conv1d(in_channels=1, out_channels=32, kernel_size=5, padding=2)
        self.bn1 = nn.BatchNorm1d(32)
        self.pool1 = nn.MaxPool1d(kernel_size=2)

        if num_layers >= 2:
            self.conv2 = nn.Conv1d(in_channels=32, out_channels=64, kernel_size=5, padding=2)
            self.bn2 = nn.BatchNorm1d(64)
            self.pool2 = nn.MaxPool1d(kernel_size=2)

        if num_layers >= 3:
            self.conv3 = nn.Conv1d(in_channels=64, out_channels=128, kernel_size=5, padding=2)
            self.bn3 = nn.BatchNorm1d(128)
            self.pool3 = nn.MaxPool1d(kernel_size=2)

        if num_layers >= 4:
            self.conv4 = nn.Conv1d(in_channels=128, out_channels=256, kernel_size=3, padding=1)
            self.bn4 = nn.BatchNorm1d(256)
            self.pool4 = nn.MaxPool1d(kernel_size=2)

        fc_input_size = self._calculate_fc_input_size(input_length)

        self.fc1 = nn.Linear(fc_input_size, 256)
        self.dropout1 = nn.Dropout(0.5)
        self.fc2 = nn.Linear(256, 128)
        self.dropout2 = nn.Dropout(0.3)
        self.fc3 = nn.Linear(128, 2)

    def _calculate_fc_input_size(self, input_length):
        size = input_length
        for _ in range(self.num_layers):
            size = size // 2
        channels = [32, 64, 128, 256][self.num_layers - 1]
        return size * channels

    def forward(self, x):
        x = F.relu(self.bn1(self.conv1(x)))
        x = self.pool1(x)

        if self.num_layers >= 2:
            x = F.relu(self.bn2(self.conv2(x)))
            x = self.pool2(x)

        if self.num_layers >= 3:
            x = F.relu(self.bn3(self.conv3(x)))
            x = self.pool3(x)

        if self.num_layers >= 4:
            x = F.relu(self.bn4(self.conv4(x)))
            x = self.pool4(x)

        x = x.view(x.size(0), -1)

        x = F.relu(self.fc1(x))
        x = self.dropout1(x)
        x = F.relu(self.fc2(x))
        x = self.dropout2(x)
        x = self.fc3(x)

        return x


class ExoplanetLSTM(nn.Module):
    def __init__(self, input_size=1, hidden_size=128, num_layers=2):
        super(ExoplanetLSTM, self).__init__()

        self.hidden_size = hidden_size
        self.num_layers = num_layers

        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=0.3 if num_layers > 1 else 0
        )

        self.fc1 = nn.Linear(hidden_size, 64)
        self.dropout = nn.Dropout(0.5)
        self.fc2 = nn.Linear(64, 2)

    def forward(self, x):
        x = x.permute(0, 2, 1)

        lstm_out, (h_n, c_n) = self.lstm(x)

        x = h_n[-1]

        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)

        return x


def create_model(architecture='cnn_1d', num_layers=3, input_length=1000):
    if architecture == 'cnn_1d':
        return ExoplanetCNN(input_length=input_length, num_layers=num_layers)
    elif architecture == 'lstm':
        return ExoplanetLSTM(num_layers=num_layers)
    else:
        raise ValueError(f"Unknown architecture: {architecture}")


def train_model(model, train_loader, val_loader, config, device='cpu'):
    import torch.optim as optim

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=config['learning_rate'])

    model.to(device)
    model.train()

    training_history = {
        'train_loss': [],
        'train_acc': [],
        'val_loss': [],
        'val_acc': []
    }

    for epoch in range(config['epochs']):
        running_loss = 0.0
        correct = 0
        total = 0

        for inputs, labels in train_loader:
            inputs, labels = inputs.to(device), labels.to(device)

            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item()
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()

        train_loss = running_loss / len(train_loader)
        train_acc = correct / total

        model.eval()
        val_loss = 0.0
        val_correct = 0
        val_total = 0

        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs, labels = inputs.to(device), labels.to(device)
                outputs = model(inputs)
                loss = criterion(outputs, labels)

                val_loss += loss.item()
                _, predicted = torch.max(outputs.data, 1)
                val_total += labels.size(0)
                val_correct += (predicted == labels).sum().item()

        val_loss /= len(val_loader)
        val_acc = val_correct / val_total

        training_history['train_loss'].append(train_loss)
        training_history['train_acc'].append(train_acc)
        training_history['val_loss'].append(val_loss)
        training_history['val_acc'].append(val_acc)

        print(f'Epoch {epoch+1}/{config["epochs"]}: '
              f'Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.4f}, '
              f'Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.4f}')

        model.train()

    return model, training_history


def evaluate_model(model, test_loader, device='cpu'):
    from sklearn.metrics import confusion_matrix, precision_score, recall_score, f1_score, accuracy_score

    model.to(device)
    model.eval()

    all_predictions = []
    all_labels = []

    with torch.no_grad():
        for inputs, labels in test_loader:
            inputs = inputs.to(device)
            outputs = model(inputs)
            _, predicted = torch.max(outputs.data, 1)

            all_predictions.extend(predicted.cpu().numpy())
            all_labels.extend(labels.numpy())

    accuracy = accuracy_score(all_labels, all_predictions)
    precision = precision_score(all_labels, all_predictions)
    recall = recall_score(all_labels, all_predictions)
    f1 = f1_score(all_labels, all_predictions)
    cm = confusion_matrix(all_labels, all_predictions)

    return {
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1_score': f1,
        'confusion_matrix': cm.tolist()
    }
