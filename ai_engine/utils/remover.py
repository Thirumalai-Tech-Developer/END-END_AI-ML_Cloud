import os

def remove_file_if_exists(file_path):
    """Remove a file if it exists."""
    if os.path.exists(file_path):
        os.remove(file_path)
        print(f"Removed the file: {file_path}")
    else:
        print(f"The file {file_path} does not exist.")