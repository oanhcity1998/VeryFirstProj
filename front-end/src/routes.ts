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
    opportunityDetail: "/crm/opportunitylist/:id",
    leadList: "/crm/leadlist",
    leadDetail: "/crm/leads/:id",
  },
  hrm: {
    employeeList: "/hrm/employee-list",
    employeeDetail: "/hrm/employee-list/:id",
    positionList: "/hrm/position-list",
    departmentList: "/hrm/department-list",
  },
};
