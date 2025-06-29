#!/bin/bash

# Usage: ./save_tree_contents.sh [directory] [output_file]
# Example: ./save_tree_contents.sh . tree_contents.txt

DIR="${1:-.}"                       # Directory to scan (default: current)
OUTPUT="${2:-tree_contents.txt}"    # Output file (default: tree_contents.txt)

# Empty the output file
> "$OUTPUT"

# Find files up to 4 levels deep, excluding node_modules and dist directories
find "$DIR" \
    -type d \( -name "node_modules" -o -name "dist" \) -prune -false -o \
    -type f -mindepth 1 -maxdepth 4 | while read -r file; do
        echo "==== FILE: $file" >> "$OUTPUT"
        cat "$file" >> "$OUTPUT"
        echo -e "\n" >> "$OUTPUT"
done

echo "All file paths and contents saved to $OUTPUT"

