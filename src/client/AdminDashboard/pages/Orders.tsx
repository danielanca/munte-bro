import React, { useEffect, useState } from "react";
import { getAllOrders, deleteOrderByID } from "../../data/productList";
import ConfirmDialog from "./ConfirmDialog";
import "./Orders.css";

interface ProductType {
  id: string;
  name: string;
  itemNumber: string;
  imageProduct: string;
  price: string;
  discountedPrice: string;
  realStock: string;
  realStockCheck: string;
  fakeStock: string;
  fakeStockCheck: string;
}

interface OrderType {
  orderId: string;
  cartProducts: ProductType[];
  cartSum: number;
  city: string;
  county: string;
  deliveryAddress: string;
  deliveryName: string;
  emailAddress: string;
  firstName: string;
  invoiceID: string;
  lastName: string;
  orderNotes: string;
  paymentMethod: string;
  paymentStatus: string;
  phoneNo: string;
  shippingTax: number;
  timestamp: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getAllOrders();
      setOrders(data);
    };

    fetchOrders();
  }, []);

  const handleDeleteClick = (orderId: string) => {
    setOrderToDelete(orderId);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (orderToDelete) {
      try {
        await deleteOrderByID(orderToDelete);
        setOrders(prevOrders => prevOrders.filter(order => order.orderId !== orderToDelete));
        setShowConfirmDialog(false);
        setOrderToDelete(null);
      } catch (error) {
        console.error("Failed to delete order:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
    setOrderToDelete(null);
  };

  return (
    <section>
      <h2 className="title">Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            {/* <th>Email</th> */}
            {/* <th>Products</th> */}
            <th>Total Amount</th>
            <th>Order Date</th>
            <th>Status</th>
            <th>Payment Method</th>
             <th>Delivery Address</th> 
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <tr key={index}>
                <td>{order.orderId}</td>
                <td>
                  {order.firstName} {order.lastName}
                </td>
                {/* <td>{order.emailAddress}</td> */}
                {/* <td>
                  {order.cartProducts.map((product, index) => (
                    <div key={index}>
                      <img src={product.imageProduct} alt={product.name} className="product-image" />
                      <span>
                        {product.name} - {product.itemNumber} x ${product.price}
                      </span>
                    </div>
                  ))}
                </td> */}
                <td>RON {order.cartSum.toFixed(2)}</td>
                <td>{order.timestamp}</td>
                <td>{order.paymentStatus}</td>
                <td>{order.paymentMethod}</td>
                <td>
                  {/* {order.deliveryAddress}, */}
                   {order.city}, {order.county}
                </td>
                <td>
                  <button className="delete-button" onClick={() => handleDeleteClick(order.orderId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9}>Loading orders...</td>
            </tr>
          )}
        </tbody>
      </table>
      {showConfirmDialog && (
        <ConfirmDialog
          message="Are you sure you want to delete this order?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </section>
  );
};

export default Orders;
