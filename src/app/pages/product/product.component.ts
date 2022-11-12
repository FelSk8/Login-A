import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

import Swal from 'sweetalert2';
import { FormComponent } from './form/form.component';
import { CategoryI, ProductI } from './product';
import { ProductService } from './product.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit , OnDestroy, AfterViewInit {
 
  dataSource: any= [ ];
  displayedColumns: string[] = ['id', 'codBarra',  'name', 'marca', 'stock', 'venta', 'price', 'actions'];
  private subscribe:Subscription = new Subscription();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private productSvc: ProductService,
    private matDialog: MatDialog
  ) { }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator._intl.itemsPerPageLabel = 'Productos por página';
  }
  ngOnDestroy(): void {
    this.subscribe.unsubscribe();
  } 

  ngOnInit(): void {
    this.productSvc.getAllProducts().subscribe(res=>{
      console.log(res);
    });
    this.getProducts();
  }
  
  

  getProducts(){
    this.productSvc.getAllProducts().subscribe((products:ProductI[])=>{
      this.dataSource = new MatTableDataSource<ProductI>(products);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onDelete(id: string): void {

    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, bórralo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productSvc.delete(id).subscribe(res => {
          console.log(res);
          this.getProducts();
        });
        Swal.fire(
          '¡Eliminado!',
          'El producto ha sido eliminado.',
          'success'
        )
      }
    })
  }
   /* console.log(id);
    this.productSvc.delete(id).subscribe(res => {
      console.log(res);
      this.getProducts();
    });*/
  

  onUpdateProduct(id:string,product:ProductI): void {
    this.subscribe?.add(
    this.productSvc.updateProduct(id,product).subscribe(res=>{
      console.log(res);
      if (res) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Producto actualizado',
          showConfirmButton: false,
          timer: 1500
        })
        this.getProducts();
      }
    })
    );

  
  }

  onEdit(id: string): void {
    this.productSvc.getById(id).subscribe((res:any)=>{
     let  categoriesId:CategoryI[] = res.categories.map((res :ProductI)=>res.id);
      console.log(categoriesId);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        name: res.name,
        codBarra: res.codBarra,
        marca: res.marca,
        stock: res.stock,
        venta: res.venta,
        price: res.price,
        categories: categoriesId
    }
      const dialogRef = this.matDialog.open(FormComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(res => {
        if (res) {

          this.onUpdateProduct(id,res);
        }
      });
    });
  }

  onNewProduct(product:ProductI): void { 
    this.subscribe?.add(
    this.productSvc.newProduct(product).subscribe(res => {
      console.log(res);
      if (res) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Producto agregado',
          showConfirmButton: false,
          timer: 1500
        })
        this.getProducts();
      }
    
    })
    ); 
  }



  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.matDialog.open(FormComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.onNewProduct(res);
      }
    });

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


     
}
