export class ResizeHelper {
    private startY: number = 0;
    private startHeight: number = 0;
    private resizing: boolean = false;
    private mouseMoveListener: any;
    private mouseUpListener: any;

    startColumnResize(event: MouseEvent, column: string): void {
        event.preventDefault();

        const startX = event.pageX;
        const th = document.querySelector(`th[data-column="${column}"]`) as HTMLElement;
        const startWidth = th.offsetWidth;

        const mouseMove = (e: MouseEvent) => {
            const newWidth = startWidth + (e.pageX - startX);
            th.style.width = `${newWidth}px`;
            th.style.minWidth = `${newWidth}px`;
            th.style.maxWidth = `${newWidth}px`;
        };

        const stopResize = () => {
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', stopResize);
        };

        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', stopResize);
    }

    initResize(
        event: MouseEvent,
        tableSelector: string,
        containerSelector: string
    ) {
        event.preventDefault();
        const tableContainer = document.querySelector(tableSelector) as HTMLElement;
        const growTile = document.querySelector(containerSelector) as HTMLElement;

        this.startY = event.clientY;
        this.startHeight = tableContainer.clientHeight;
        this.resizing = true;

        this.mouseMoveListener = (e: MouseEvent) => {
            this.resize(e, tableContainer, growTile);
        };
        this.mouseUpListener = () => {
            this.stopResize();
        };

        document.addEventListener('mousemove', this.mouseMoveListener);
        document.addEventListener('mouseup', this.mouseUpListener);
        document.body.classList.add('resizing');
    }

    private resize(
        event: MouseEvent,
        tableContainer: HTMLElement,
        growTile: HTMLElement
    ) {
        if (!this.resizing) return;

        const deltaY = event.clientY - this.startY;
        const fullViewHeight = window.innerHeight;
        const growTileHeight = growTile.clientHeight;

        const newTableHeight = Math.max(100, Math.min(this.startHeight + deltaY, fullViewHeight - 165));
        tableContainer.style.height = `${newTableHeight}px`;
        tableContainer.style.flex = 'none';

    }

    private stopResize() {
        this.resizing = false;
        this.removeResizeListeners();
        document.body.classList.remove('resizing');
    }

    private removeResizeListeners() {
        if (this.mouseMoveListener) {
            document.removeEventListener('mousemove', this.mouseMoveListener);
            this.mouseMoveListener = null;
        }

        if (this.mouseUpListener) {
            document.removeEventListener('mouseup', this.mouseUpListener);
            this.mouseUpListener = null;
        }
    }
}
