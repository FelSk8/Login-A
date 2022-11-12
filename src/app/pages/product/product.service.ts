import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserResponseI } from 'src/app/auth/interfaces/user';
import { environment } from 'src/environments/environment';
import { CategoryI, ProductI } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  products$ :Observable<ProductI[]> |  undefined;
  categories$ :Observable<CategoryI[]> |  undefined;//Obtener productos por categoria
  constructor(
    private http:HttpClient
  ) { }


  getAllProducts():Observable<ProductI[]>{
    this.products$=this.http.get<ProductI[]>(environment.baseUrl+'/product');
    return this.products$
  }

  delete(id:String):Observable<UserResponseI | void>{
    return this.http.delete<UserResponseI | void>(`${environment.baseUrl}/product/${id}`).pipe(
      map((res:UserResponseI)=>{
        return res;
      })
    );
        
  }

  newProduct(product:ProductI):Observable<UserResponseI | void>{
    return this.http.post<UserResponseI | void>(`${environment.baseUrl}/product`,product).pipe(
      map((res:UserResponseI)=>{
        return res;
      })
    );
  }


  getById(id:String):Observable<ProductI | void>{
    return this.http.get<ProductI | void>(`${environment.baseUrl}/product/${id}`);
  }

  updateProduct(id:string,product:ProductI):Observable<UserResponseI | void>{
    return this.http.patch<UserResponseI | void>(`${environment.baseUrl}/product/${id}`,product).pipe(
      map((res:UserResponseI)=>{
        return res;
      })
    );
  }

   getAllCategories():Observable<CategoryI[]>{//Obtener categorias
   this.categories$= this.http.get<CategoryI[]>(environment.baseUrl+'/category');//Obtener categorias
   return this.categories$;// retornar categorias
  }

 
 
}
