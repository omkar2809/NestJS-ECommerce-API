interface ProductOrderDTO {
    product: string;
    quantity: number;
}

export interface CreateOrderDTO {
    products: ProductOrderDTO[];
}

// export interface CreateOrderDTO {
//     products: [{
//       product: string;
//       quantity: number;
//     }];
//   }
