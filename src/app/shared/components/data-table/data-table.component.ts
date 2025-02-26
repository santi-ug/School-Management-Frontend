import { Component, Input, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

@Component({
  selector: "app-data-table",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="table-container">
      <div class="table-actions">
        <div class="search-container">
          <input 
            type="text" 
            placeholder="Buscar..." 
            [(ngModel)]="searchTerm"
            (input)="onSearch()"
            class="search-input"
          />
        </div>
        <button class="add-button" (click)="onAdd.emit()">Agregar Nuevo</button>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            @for (column of columns; track column.key) {
              <th (click)="sortBy(column.key)">
                {{ column.label }}
                @if (sortColumn === column.key) {
                  <span class="sort-icon">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                }
              </th>
            }
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          @if (filteredData.length === 0) {
            <tr>
              <td [attr.colspan]="columns.length + 1" class="no-data">No hay datos disponibles</td>
            </tr>
          } @else {
            @for (item of paginatedData; track item.id || $index) {
              <tr>
                @for (column of columns; track column.key) {
                  <td>{{ formatValue(item[column.key], column.format) }}</td>
                }
                <td class="actions-cell">
                  <button class="action-button view" (click)="onView.emit(item)">Ver</button>
                  <button class="action-button edit" (click)="onEdit.emit(item)">Editar</button>
                  <button class="action-button delete" (click)="onDelete.emit(item)">Eliminar</button>
                </td>
              </tr>
            }
          }
        </tbody>
      </table>

      <div class="pagination">
        <button 
          [disabled]="currentPage === 1" 
          (click)="changePage(currentPage - 1)"
          class="pagination-button"
        >
          Anterior
        </button>
        <span class="page-info">
          Página {{ currentPage }} de {{ totalPages }}
        </span>
        <button 
          [disabled]="currentPage === totalPages" 
          (click)="changePage(currentPage + 1)"
          class="pagination-button"
        >
          Siguiente
        </button>
      </div>
    </div>
  `,
  styles: [
    `
    .table-container {
      width: 100%;
      overflow: auto;
    }
    .table-actions {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    .search-input {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 250px;
    }
    .add-button {
      background-color: #4caf50;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
    }
    .data-table th, .data-table td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    .data-table th {
      background-color: #f2f2f2;
      cursor: pointer;
    }
    .data-table tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    .data-table tr:hover {
      background-color: #f1f1f1;
    }
    .sort-icon {
      margin-left: 5px;
    }
    .actions-cell {
      white-space: nowrap;
    }
    .action-button {
      margin-right: 5px;
      padding: 5px 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .view {
      background-color: #2196F3;
      color: white;
    }
    .edit {
      background-color: #FFC107;
      color: black;
    }
    .delete {
      background-color: #F44336;
      color: white;
    }
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 1rem;
    }
    .pagination-button {
      padding: 8px 16px;
      margin: 0 5px;
      border: 1px solid #ddd;
      background-color: #f1f1f1;
      cursor: pointer;
      border-radius: 4px;
    }
    .pagination-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .page-info {
      margin: 0 10px;
    }
    .no-data {
      text-align: center;
      padding: 20px;
    }
  `,
  ],
})
export class DataTableComponent {
  @Input() data: any[] = []
  @Input() columns: { key: string; label: string; format?: string }[] = []
  @Input() pageSize = 10

  @Output() onView = new EventEmitter<any>()
  @Output() onEdit = new EventEmitter<any>()
  @Output() onDelete = new EventEmitter<any>()
  @Output() onAdd = new EventEmitter<void>()

  searchTerm = ""
  currentPage = 1
  sortColumn = ""
  sortDirection: "asc" | "desc" = "asc"
  filteredData: any[] = []

  ngOnInit() {
    this.filteredData = [...this.data]
  }

  ngOnChanges() {
    this.filteredData = [...this.data]
    this.applySort()
    this.currentPage = 1
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize)
  }

  get paginatedData(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize
    return this.filteredData.slice(startIndex, startIndex + this.pageSize)
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredData = [...this.data]
    } else {
      const term = this.searchTerm.toLowerCase()
      this.filteredData = this.data.filter((item) => {
        return this.columns.some((column) => {
          const value = item[column.key]
          if (value === null || value === undefined) return false
          return String(value).toLowerCase().includes(term)
        })
      })
    }
    this.currentPage = 1
    this.applySort()
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc"
    } else {
      this.sortColumn = column
      this.sortDirection = "asc"
    }
    this.applySort()
  }

  applySort(): void {
    if (this.sortColumn) {
      this.filteredData.sort((a, b) => {
        const valueA = a[this.sortColumn]
        const valueB = b[this.sortColumn]

        if (valueA === valueB) return 0

        const comparison = valueA > valueB ? 1 : -1
        return this.sortDirection === "asc" ? comparison : -comparison
      })
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page
    }
  }

  formatValue(value: any, format?: string): string {
    if (value === null || value === undefined) return ""

    if (format === "date") {
      return new Date(value).toLocaleDateString()
    } else if (format === "currency") {
      return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value)
    } else if (format === "decimal") {
      return new Intl.NumberFormat("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
    }

    return String(value)
  }
}

