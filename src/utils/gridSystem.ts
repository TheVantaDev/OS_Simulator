/**
 * Grid-based icon positioning system (Windows 11 style)
 * Icons snap to invisible grid cells for consistent alignment
 */

export interface GridPosition {
    col: number;
    row: number;
}

export interface GridConfig {
    cellWidth: number;
    cellHeight: number;
    startX: number;
    startY: number;
    marginX: number;
    marginY: number;
}

/**
 * Get grid configuration based on window size
 */
export function getGridConfig(windowWidth: number, _windowHeight: number): GridConfig {
    return {
        cellWidth: 100,
        cellHeight: 120,
        startX: windowWidth - 120, // Start from right edge
        startY: 40, // Below menu bar
        marginX: 20,
        marginY: 20
    };
}

/**
 * Convert pixel position to grid cell
 */
export function pixelToGrid(x: number, y: number, config: GridConfig): GridPosition {
    const relativeX = config.startX - x;
    const relativeY = y - config.startY;

    const col = Math.floor(relativeX / config.cellWidth);
    const row = Math.floor(relativeY / config.cellHeight);

    return {
        col: Math.max(0, col),
        row: Math.max(0, row)
    };
}

/**
 * Convert grid cell to pixel position
 */
export function gridToPixel(pos: GridPosition, config: GridConfig): { x: number; y: number } {
    return {
        x: config.startX - (pos.col * config.cellWidth),
        y: config.startY + (pos.row * config.cellHeight)
    };
}

/**
 * Get the nearest grid cell to a pixel position
 */
export function snapToGrid(x: number, y: number, config: GridConfig): { x: number; y: number } {
    const gridPos = pixelToGrid(x, y, config);
    return gridToPixel(gridPos, config);
}

/**
 * Find the next available grid position
 * Fills column-by-column from top to bottom, right to left
 */
export function findNextFreeCell(
    occupiedCells: Set<string>,
    config: GridConfig,
    windowHeight: number
): GridPosition {
    const maxRows = Math.floor((windowHeight - config.startY) / config.cellHeight);

    let col = 0;
    let row = 0;

    while (true) {
        const cellKey = `${col},${row}`;

        if (!occupiedCells.has(cellKey)) {
            return { col, row };
        }

        // Move to next row
        row++;

        // If column is full, move to next column (left)
        if (row >= maxRows) {
            row = 0;
            col++;

            // If we've gone too far left, wrap to safe fallback
            if (col > 20) {
                return { col: 0, row: 0 };
            }
        }
    }
}

/**
 * Convert grid position to a string key for storage
 */
export function gridPosToKey(pos: GridPosition): string {
    return `${pos.col},${pos.row}`;
}

/**
 * Parse grid position from string key
 */
export function keyToGridPos(key: string): GridPosition {
    const [col, row] = key.split(',').map(Number);
    return { col, row };
}

/**
 * Get all grid positions sorted by display order (col, then row)
 */
export function sortGridPositions(positions: GridPosition[]): GridPosition[] {
    return [...positions].sort((a, b) => {
        if (a.col !== b.col) return a.col - b.col;
        return a.row - b.row;
    });
}

/**
 * Rearrange icons to make room when one is dropped between others
 * Returns new grid positions for all affected icons
 */
export function rearrangeGrid(
    iconIds: string[],
    gridPositions: Record<string, GridPosition>,
    draggedId: string,
    targetCell: GridPosition,
    windowHeight: number,
    config: GridConfig
): Record<string, GridPosition> {
    const newPositions = { ...gridPositions };
    const maxRows = Math.floor((windowHeight - config.startY) / config.cellHeight);

    // Helper to find icon at position (excluding the one we're currently moving)
    const findIconAt = (col: number, row: number, excludeId?: string) => {
        return iconIds.find(id => {
            if (id === excludeId) return false;
            const pos = newPositions[id];
            return pos && pos.col === col && pos.row === row;
        });
    };

    // Calculate next logical position
    const getNextPos = (col: number, row: number) => {
        let nextRow = row + 1;
        let nextCol = col;

        if (nextRow >= maxRows) {
            nextRow = 0;
            nextCol++;
        }

        return { col: nextCol, row: nextRow };
    };

    // Place the dragged icon first
    newPositions[draggedId] = targetCell;

    // Check for collision at target
    let currentPos = targetCell;
    let displacedIcon = findIconAt(currentPos.col, currentPos.row, draggedId);

    // Cascade shift: while we have a displaced icon, move it to the next slot
    // and check if that displacement causes another collision
    const processedIcons = new Set<string>([draggedId]);

    while (displacedIcon && !processedIcons.has(displacedIcon)) {
        processedIcons.add(displacedIcon);

        // Find next slot for the displaced icon
        const nextPos = getNextPos(currentPos.col, currentPos.row);

        // Check what's at the next position BEFORE moving the displaced icon there
        const nextDisplacedIcon = findIconAt(nextPos.col, nextPos.row, displacedIcon);

        // Move the displaced icon to next pos
        newPositions[displacedIcon] = nextPos;

        // Setup for next iteration
        currentPos = nextPos;
        displacedIcon = nextDisplacedIcon;
    }

    return newPositions;
}
