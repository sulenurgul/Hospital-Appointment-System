import { Component } from '@angular/core';

@Component({
  selector: 'app-department-form',
  template: `
    <section>
      <h1>Birim kaydı</h1>
      <form>
        <label>Birim adı <input name="name" required /></label>
        <button type="submit">Kaydet</button>
      </form>
    </section>
  `,
})
export class DepartmentFormComponent {}
