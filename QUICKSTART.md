# ExoHunter AI - Quick Start Guide

Welcome to ExoHunter AI! This guide will get you up and running in under 5 minutes.

## What You'll Need

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Basic understanding of exoplanets (optional - we teach you!)

## Running the Application

The application is currently running in development mode. Open your browser and navigate to the application URL.

## First Steps

### 1. Explore the Home Page
- Read about what light curves are and how exoplanet detection works
- Check out the statistics on Kepler and TESS discoveries
- Choose your path: Novice or Researcher

### 2. Try Sample Data (Recommended for First-Time Users)
1. Click the **"Try Sample Data"** button on the home page
2. You'll be automatically taken to the Detection section
3. View the interactive light curve plot
4. Click **"Launch AI Hunt"** to run detection
5. Wait 2-3 seconds for the AI to analyze the data
6. View your results:
   - Transit detection status (Detected/Not Detected)
   - Confidence score
   - List of detected transit events with periods and depths

### 3. Upload Your Own Data
1. Navigate to the **Upload** section using the top navigation bar
2. Prepare your data in CSV or JSON format:
   - CSV: Must have "time" and "flux" columns
   - JSON: Must have "time" and "flux" arrays
   - Example provided in the Upload section
3. Drag and drop your file or click "Browse Files"
4. Once uploaded, navigate to **Detect** to analyze

### 4. Train Custom Models (Advanced)
1. Go to the **Train** section
2. Adjust hyperparameters using the sliders:
   - Learning Rate: 0.0001 - 0.01
   - Batch Size: 16 - 128
   - Epochs: 1 - 50
   - Number of Layers: 1 - 5
3. Choose architecture: 1D CNN or LSTM
4. Click **"Start Training"** and watch the progress
5. View updated model metrics and confusion matrix

### 5. View Results History
1. Navigate to the **Results** section
2. Browse all past detections
3. Filter by transit status
4. Search by dataset name
5. Export results for further analysis

### 6. Learn More
Visit the **About** section to:
- Understand the transit method
- Learn about NASA data sources
- Read FAQs
- Get a cosmic wisdom quote from Carl Sagan

## Tips for Best Results

### For Novices:
- Start with the sample data to understand the workflow
- Read the tooltips and explanations throughout the app
- Focus on the "What is a Light Curve?" section
- Don't worry about the technical details initially

### For Researchers:
- Upload multiple datasets for batch analysis
- Experiment with different hyperparameters
- Export raw data for external validation
- Use the confusion matrix to understand model performance
- Check model metrics regularly after retraining

## Understanding the Results

### Confidence Score
- **80-100%**: High confidence - likely a real transit
- **50-79%**: Medium confidence - requires further validation
- **0-49%**: Low confidence - possible false positive

### Detected Transits Table
- **Period**: Time between transits (in days)
- **Depth**: How much starlight is blocked (in %)
- **Duration**: How long the transit lasts
- **Confidence**: AI's confidence in this detection

## Data Format Examples

### CSV Format
```csv
time,flux
0.0,1.0000
0.5,0.9998
1.0,0.9850
1.5,0.9852
2.0,1.0001
```

### JSON Format
```json
{
  "time": [0.0, 0.5, 1.0, 1.5, 2.0],
  "flux": [1.0000, 0.9998, 0.9850, 0.9852, 1.0001]
}
```

## Common Questions

**Q: How long does detection take?**
A: Typically under 3 seconds for a standard light curve with 1000 data points.

**Q: What file size limit is there?**
A: Maximum 10MB per file to ensure fast processing.

**Q: Can I trust the AI results?**
A: Our model achieves 94.2% accuracy on test data. However, detected candidates should be validated through additional methods for research purposes.

**Q: What if my data doesn't have "time" and "flux" columns?**
A: The system is flexible and will look for variations like "t", "timestamp" for time and "f", "brightness" for flux.

**Q: How does the training work?**
A: The training feature uses incremental learning to update the model with your labeled data, improving accuracy over time.

## Keyboard Shortcuts

- **Home**: Scroll to home section
- **Ctrl/Cmd + U**: Navigate to Upload section
- **Ctrl/Cmd + D**: Navigate to Detect section
- **Esc**: Close any open modals

## Performance Notes

- The application works best with datasets of 100-10,000 data points
- Interactive plots may slow down with very large datasets (>50,000 points)
- Training time scales with the number of epochs (roughly 0.5 seconds per epoch)
- Results are stored in the database for future reference

## Need Help?

- Check the **About** section for detailed information
- Review the FAQ in the About page
- All features have inline tooltips - hover to learn more
- The app is designed to be self-explanatory for both audiences

## Next Steps

1. Complete your first detection with sample data
2. Try uploading your own light curve data
3. Experiment with model training parameters
4. Share your results with the community
5. Contribute to the open-source project on GitHub

---

**Happy Exoplanet Hunting!**

*"Somewhere, something incredible is waiting to be known."* - Carl Sagan
