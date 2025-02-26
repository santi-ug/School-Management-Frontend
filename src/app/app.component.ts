import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { HeaderComponent } from "./core/components/header/header.component"
import { SidebarComponent } from "./core/components/sidebar/sidebar.component"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, CommonModule],
  template: `
    <div class="app-container">
      <app-header></app-header>
      <div class="content-container">
        <app-sidebar></app-sidebar>
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    .content-container {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    .main-content {
      flex: 1;
      padding: 20px;
      overflow: auto;
    }
  `,
  ],
})
export class AppComponent {
  title = "gestor-academico"
}

