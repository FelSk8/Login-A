import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryI, ProductI } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  category:CategoryI[] = [];//Formulario de categoria
  constructor(
    private fb: FormBuilder,//Formulario reactivos
    private productSvc: ProductService,//Servicio de productos
    public dialogRef: MatDialogRef<FormComponent>,//Cerrar el formulario
    @Inject(MAT_DIALOG_DATA) public data: ProductI //Recibir datos del formulario
  ) { }
 

    form = this.fb.group({//Formulario
      codBarra: ['',[Validators.required]],
      name: ['',[Validators.required]],//Validacion de campo requerido en el formulario  
      marca: ['',[Validators.required]],
      stock: ['',[Validators.required]],
      venta: ['',[Validators.required]],
      price: ['',[Validators.required]],
      categories: []
   
    }); 

  ngOnInit(): void {
    this.getCategories();
    this.initForm(this.data);
  }

  getCategories(): void {
    this.productSvc.getAllCategories().subscribe((categories: CategoryI[]) => {
      this.category= categories;  
     // console.log('category',this.category);   
    });
  }

  close():void{ //Cerrar el formulario
    this.dialogRef.close();
    
  }

  initForm(data: ProductI): void {
  if(data){
    this.form.patchValue({
      codBarra: data.codBarra,
      name: data.name,
      marca: data.marca,
      stock: data.stock.toString(),
      venta: data.venta.toString(),
      price: data.price.toString(),
      categories: data.categories 
    });
  }
  }

  isValidField(field:string):string{//Validacion de campo requerido en el formulario
    const validatedField=this.form.get(field);
    return (!validatedField?.valid && validatedField?.touched)?'is-invalid': validatedField?.touched?'is-valid':'';
  }

}
