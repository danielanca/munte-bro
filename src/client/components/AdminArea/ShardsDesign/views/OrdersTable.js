// @ts-nocheck
import React from "react";

import { Container, Row, Col, Card, CardHeader, CardBody } from "shards-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import RangeDatePicker from "../components/common/RangeDatePicker";
import PageTitle from "../components/common/PageTitle";
import { requestOrdersList } from "../../../../services/emails";
import { convertDate } from "../../Dashboard/funcs";

const dayOffSet = 1000 * 58 * 60 * 24;

// old table with filter
// latest-transaction.js
const OrdersTable = () => {
    const [ordersLocal, setOrdersLocal] = useState(null);
    const [filterDates, setFilterDates] = useState({ startDate: 0, endDate: 0 });
    const [ordersList, setOrdersList] = useState(null);
    let today = new Date().getMilliseconds();
  
    useEffect(() => {
        requestOrdersList().then((res) => {
          if (typeof res === "object") {
            res.json().then((data) => {
              let ordersItems = Object.values(data)[0];
              setOrdersLocal(ordersItems);
              setOrdersList(ordersItems);
            });
          }
        });
      }, []);

      const handleDateInputs = (data) => {

        setFilterDates((filterDates)=> ({...filterDates,
            startDate: new Date(data.dates.startDate).getTime(),
            endDate: new Date(data.dates.endDate).getTime() + dayOffSet
        }))
        // let { name, value } = event.target;
        // let numericalDate = new Date(value).getTime();
        // numericalDate = isNaN(numericalDate) ? 0 : numericalDate;
        // if (numericalDate > 0 && name === "endDate") {
        //   numericalDate += dayOffSet;
        // }
        // setFilterDates((filterDates) => ({ ...filterDates, [name]: numericalDate }));
      };
    
      useEffect(() => {
        console.log("Filters dates are:", filterDates);
        if (filterDates.endDate !== 0 && filterDates.startDate !== 0) {
          let filteredList = ordersLocal.filter((orderObject) => {
            let newDateFormat = convertDate(orderObject.timestamp);
            if (newDateFormat >= filterDates.startDate && newDateFormat <= filterDates.endDate) {
              return true;
            }
          });
          console.log("Filtered list:", filteredList);
          setOrdersList(filteredList);
        } else {
          setOrdersList(ordersLocal);
        }
      }, [filterDates]);

  return ( <Container fluid className="main-content-container px-4">
    {/* Page Header */}
    <Row noGutters className="page-header py-4">
      <PageTitle sm="4" title="Lista comenzi" subtitle="Orders List" className="text-sm-left" />
    </Row>
    <Row>
      <RangeDatePicker  onValues={handleDateInputs}/>
    </Row>
    {/* Default Light Table */}
    <Row>
      <Col>
        <Card small className="mb-4">
          <CardHeader className="border-bottom">
            <h6 className="m-0">Active Users</h6>
          </CardHeader>
          <CardBody className="p-0 pb-3">
            <table className="table p-0 mb-0">
              <thead className="bg-light">
                <tr>
                  <th scope="col" className="border-0">
                   Data 
                  </th>
                  <th scope="col" className="border-0">
                    Nume Client
                  </th>
                  <th scope="col" className="border-0">
                    Valoare comanda
                  </th>
                  <th scope="col" className="border-0">
                    Status Plata
                  </th>
                  <th scope="col" className="border-0">
                    Actiuni
                  </th>
                  <th scope="col" className="border-0">
                    Factura
                  </th>
                </tr>
              </thead>
              <tbody>
                { ordersList?.map( item=>{
                    return  <tr className={today}>
                            <td>{item.timestamp}</td>
                            <td className="font-weight-bold p-0">{`${item.firstName} ${item.lastName}`}</td>
                            <td>{`${item.shippingTax + item.cartSum} RON `}</td>
                            <td>
                            <button
                            className={`mb-2 mr-1 w-50 btn btn-sm badge btn-${
                              item.paymentStatus === "PAID" ? "success" : "warning"
                            } font-size-20`}
                          >
                            {item.paymentStatus === "NOT_PAID" ? "UNPAID" : "PAID"}
                          </button>
                        </td>
                            <td>
                          <Link target={"_blank"} to={`/order/${item.invoiceID}`} className="btn btn-primary btn-sm">
                            VIZUALIZEAZA
                          </Link>
                        </td>
                        <td>{`#${item.invoiceID}`}</td>
                    </tr>
                })}
                
              </tbody>
            </table>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>)
};


export default OrdersTable;
