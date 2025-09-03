export const ROUTES_APP = {
  login: "/login",
  home: "/",
  profile: "/profile",
  crm: {
    customerList: "/crm/customerlist",
    customerDetail: "/crm/customerlist/:id",
    productPage: "/crm/productlist",
    contactList: "/crm/contactlist",
    contactDetail: "/crm/contactlist/:id",
    quotationList: "/crm/quotationlist",
    quotationDetail: "/crm/quotationlist/:id",
    opportunityList: "/crm/opportunitylist",
    leadList: "/crm/leadlist",
    leadDetail: "/crm/leads/:id",
  },
  hrm: {
    employeeList: "/hrm/employee-list",
    employeeEdit: "/hrm/employeelist/edit/:id",
    employeeDetail: "/hrm/employee-list/:id",
    positionList: "/hrm/position",
  },
};
