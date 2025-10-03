import requests
import pandas as pd
import numpy as np
from pathlib import Path
import time

NASA_EXOPLANET_API = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync"

def fetch_confirmed_exoplanets(limit=1000):
    query = f"""
    SELECT TOP {limit}
        pl_name, hostname, pl_orbper, pl_rade, pl_masse,
        pl_tranflag, sy_dist, disc_year, discoverymethod
    FROM ps
    WHERE pl_tranflag = 1
    ORDER BY disc_year DESC
    """

    params = {
        'query': query,
        'format': 'csv'
    }

    print(f"Fetching confirmed exoplanets from NASA Exoplanet Archive...")

    try:
        response = requests.get(NASA_EXOPLANET_API, params=params, timeout=30)
        response.raise_for_status()

        data_dir = Path(__file__).parent / 'datasets'
        data_dir.mkdir(exist_ok=True)

        output_file = data_dir / 'confirmed_exoplanets.csv'
        with open(output_file, 'w') as f:
            f.write(response.text)

        df = pd.read_csv(output_file)
        print(f"Successfully fetched {len(df)} confirmed exoplanets")
        print(f"Saved to: {output_file}")

        return df

    except Exception as e:
        print(f"Error fetching exoplanet data: {e}")
        return None


def generate_synthetic_light_curves(num_samples=1000, sequence_length=1000):
    print(f"Generating {num_samples} synthetic light curves...")

    data_dir = Path(__file__).parent / 'datasets'
    data_dir.mkdir(exist_ok=True)

    all_data = []

    for i in range(num_samples):
        has_transit = i < num_samples // 2

        time = np.arange(0, sequence_length) * 0.1
        flux = np.ones(sequence_length) + np.random.normal(0, 0.002, sequence_length)

        if has_transit:
            period = np.random.uniform(150, 250)
            transit_width = np.random.uniform(15, 25)
            transit_depth = np.random.uniform(0.01, 0.02)

            for t_idx in range(sequence_length):
                phase = t_idx % period
                if period / 2 - transit_width / 2 <= phase <= period / 2 + transit_width / 2:
                    flux[t_idx] -= transit_depth

        sample_data = {
            'sample_id': i,
            'has_transit': int(has_transit),
            'time': time.tolist(),
            'flux': flux.tolist()
        }

        all_data.append(sample_data)

        if (i + 1) % 100 == 0:
            print(f"Generated {i + 1}/{num_samples} samples...")

    import json
    output_file = data_dir / 'synthetic_light_curves.json'
    with open(output_file, 'w') as f:
        json.dump(all_data, f)

    print(f"Successfully generated {num_samples} synthetic light curves")
    print(f"Saved to: {output_file}")

    return all_data


def fetch_kepler_data_sample():
    print("Fetching Kepler mission data sample...")

    query = """
    SELECT TOP 100
        kepid, koi_period, koi_depth, koi_duration, koi_disposition
    FROM cumulative
    WHERE koi_disposition = 'CONFIRMED' OR koi_disposition = 'FALSE POSITIVE'
    """

    params = {
        'query': query,
        'format': 'csv'
    }

    try:
        response = requests.get(NASA_EXOPLANET_API, params=params, timeout=30)
        response.raise_for_status()

        data_dir = Path(__file__).parent / 'datasets'
        data_dir.mkdir(exist_ok=True)

        output_file = data_dir / 'kepler_sample.csv'
        with open(output_file, 'w') as f:
            f.write(response.text)

        df = pd.read_csv(output_file)
        print(f"Successfully fetched {len(df)} Kepler objects")
        print(f"Saved to: {output_file}")

        return df

    except Exception as e:
        print(f"Error fetching Kepler data: {e}")
        return None


def prepare_training_dataset():
    print("\n=== Preparing Training Dataset ===\n")

    exoplanets_df = fetch_confirmed_exoplanets(limit=500)

    if exoplanets_df is not None:
        print(f"\nExoplanet data summary:")
        print(exoplanets_df.head())
        print(f"\nColumns: {exoplanets_df.columns.tolist()}")

    kepler_df = fetch_kepler_data_sample()

    if kepler_df is not None:
        print(f"\nKepler data summary:")
        print(kepler_df.head())

    synthetic_data = generate_synthetic_light_curves(num_samples=1000)

    print("\n=== Dataset Preparation Complete ===")
    print(f"Total synthetic light curves: {len(synthetic_data)}")
    print(f"Transit samples: {sum(1 for s in synthetic_data if s['has_transit'])}")
    print(f"No-transit samples: {sum(1 for s in synthetic_data if not s['has_transit'])}")

    return {
        'exoplanets': exoplanets_df,
        'kepler': kepler_df,
        'synthetic': synthetic_data
    }


if __name__ == "__main__":
    datasets = prepare_training_dataset()
    print("\nDataset preparation completed successfully!")
