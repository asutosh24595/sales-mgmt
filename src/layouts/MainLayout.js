import {
  Box,
  Flex,
  Text,
  Button,
  TabList,
  Tab,
  Tabs,
  TabPanels,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import SaleOrderModal from "../modals/SaleOrderModal";
import { useState, useEffect } from "react";
import EditOrderModal from "../modals/EditOrderModal";
import ViewOrderModal from "../modals/ViewOrderModal";

export default function MainLayout({ setTheme, isDarkMode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSalesData, setActiveSalesData] = useState([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);
  const [completedSalesData, setCompletedSalesData] = useState([]);

  useEffect(() => {
    const storedActiveSalesData =
      JSON.parse(localStorage.getItem("activeSalesData")) || [];
    const storedCompletedSalesData =
      JSON.parse(localStorage.getItem("completedSalesData")) || [];
    setActiveSalesData(storedActiveSalesData);
    setCompletedSalesData(storedCompletedSalesData);
  }, []);

  const handleTabClick = () => {
    setIsModalOpen(true);
  };

  const handleEditModalClick = (sale) => {
    setCurrentSale(sale);
    setEditModalOpen(true);
  };

  const handleViewModalClick = (sale) => {
    setCurrentSale(sale);
    setViewModalOpen(true);
  };

  const saveSalesData = (salesData) => {
    localStorage.setItem("activeSalesData", JSON.stringify(salesData));
    setActiveSalesData(salesData);
  };

  const handleFormSubmit = (data) => {
    const currentDate = new Date();
    const dateOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
    const timeOptions = { hour: "numeric", minute: "2-digit", hour12: true };
    const formattedDate = currentDate.toLocaleDateString("en-IN", dateOptions);
    const formattedTime = currentDate.toLocaleTimeString("en-US", timeOptions);
    const formattedDateTime = `${formattedDate} (${formattedTime})`;

    const newSale = {
      customer_name: data.customer_name,
      customer_id: data.customer_id,
      invoice_date: data.invoice_date,
      invoice_no: data.invoice_no,
      products: data.products,
      items: data.items,
      paid: data.paid,
      last_modified: formattedDateTime,
    };

    let existingSalesData =
      JSON.parse(localStorage.getItem("activeSalesData")) || [];

    existingSalesData.push(newSale);

    saveSalesData(existingSalesData);

    setActiveSalesData(existingSalesData);
    setIsModalOpen(false);
    setActiveTabIndex(0);
  };

  const handleEditFormSubmit = (updatedSale) => {
    console.log(updatedSale);

    let updatedSalesData = activeSalesData.map((sale) => {
      if (sale.invoice_no === updatedSale.invoice_no) {
        const currentDate = new Date();
        const dateOptions = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        };
        const timeOptions = {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        };
        const formattedDate = currentDate.toLocaleDateString(
          "en-IN",
          dateOptions
        );
        const formattedTime = currentDate.toLocaleTimeString(
          "en-US",
          timeOptions
        );
        const formattedDateTime = `${formattedDate} (${formattedTime})`;

        return {
          ...sale,
          customer_name: updatedSale.customer_name,
          customer_id: updatedSale.customer_id,
          invoice_date: updatedSale.invoice_date,
          products: updatedSale.products,
          paid: updatedSale.paid,
          last_modified: formattedDateTime,
          items: updatedSale.items,
        };
      }
      return sale;
    });

    if (updatedSale.paid) {
      let existingCompletedSalesData =
        JSON.parse(localStorage.getItem("completedSalesData")) || [];

      const completedSale = {
        ...updatedSale,
        last_modified: new Date().toLocaleString("en-IN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      };

      existingCompletedSalesData.push(completedSale);
      localStorage.setItem(
        "completedSalesData",
        JSON.stringify(existingCompletedSalesData)
      );
      setCompletedSalesData(existingCompletedSalesData);

      updatedSalesData = updatedSalesData.filter(
        (sale) => sale.invoice_no !== updatedSale.invoice_no
      );
    }

    saveSalesData(updatedSalesData);
    setEditModalOpen(false);
  };
  return (
    <>
      <Box
        bgColor={isDarkMode ? "black" : "white"}
        color={isDarkMode ? "white" : "black"}
      >
        <Flex
          justify="space-around"
          align="center"
          p={4}
          bg={isDarkMode ? "gray.800" : "gray.200"}
          color={isDarkMode ? "white" : "black"}
        >
          <Text fontSize="xl" fontWeight="bold">
            Logo
          </Text>
          <Flex>
            <Text mr={4}>Home</Text>
            <Text mr={4}>About</Text>
            <Text mr={4}>Services</Text>
            <Text mr={4}>Contact</Text>
          </Flex>
          <Button onClick={setTheme}>
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </Button>
        </Flex>
      </Box>
      <Box
        bgColor={isDarkMode ? "black" : "white"}
        color={isDarkMode ? "white" : "black"}
        width="100%"
        height="100vh"
      >
        <Tabs
          variant="soft-rounded"
          p={4}
          index={activeTabIndex}
          onChange={(index) => setActiveTabIndex(index)}
        >
          <TabList>
            <Tab>Active Sale Orders</Tab>
            <Tab>Completed Sale Orders</Tab>
            <Tab ml="auto" onClick={handleTabClick}>
              + Sale Order
            </Tab>
          </TabList>
          <TabPanels textAlign="center">
            <TabPanel>
              {activeSalesData && (
                <TableContainer mt={50} p={4}>
                  <Table variant="simple" textAlign="center">
                    <Thead>
                      <Tr>
                        <Th>ID</Th>
                        <Th>Customer Name</Th>
                        <Th>Price (₹)</Th>
                        <Th>Last Modified</Th>
                        <Th>Edit/View</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {activeSalesData.map((sale, index) => (
                        <Tr key={index}>
                          <Td>{sale.customer_id}</Td>
                          <Td>{sale.customer_name}</Td>
                          <Td>
                            ₹{" "}
                            {sale.items.reduce(
                              (total, item) =>
                                total + item.price * item.quantity,
                              0
                            )}
                          </Td>
                          <Td>{sale.last_modified}</Td>
                          <Td>
                            <Button onClick={() => handleEditModalClick(sale)}>
                              ...
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}
            </TabPanel>
            <TabPanel>
              {completedSalesData && (
                <TableContainer mt={50}>
                  <Table variant="simple" textAlign="center">
                    <Thead>
                      <Tr>
                        <Th>ID</Th>
                        <Th>Customer Name</Th>
                        <Th>Price (₹)</Th>
                        <Th>Last Modified</Th>
                        <Th>Edit/View</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {completedSalesData.map((sale, index) => (
                        <Tr key={index}>
                          <Td>{sale.customer_id}</Td>
                          <Td>{sale.customer_name}</Td>
                          <Td>
                            ₹{" "}
                            {sale.items.reduce(
                              (total, item) =>
                                total + item.price * item.quantity,
                              0
                            )}
                          </Td>
                          <Td>{sale.last_modified}</Td>
                          <Td>
                            <Button onClick={() => handleViewModalClick(sale)}>
                              ...
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}{" "}
            </TabPanel>
            <TabPanel></TabPanel>
          </TabPanels>
        </Tabs>
        <SaleOrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onFormSubmit={handleFormSubmit}
          isDarkMode={isDarkMode}
        />
        <EditOrderModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          sale={currentSale}
          onFormSubmit={handleEditFormSubmit}
          isDarkMode={isDarkMode}

        />
        <ViewOrderModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          sale={currentSale}
          isDarkMode={isDarkMode}

        />
      </Box>
    </>
  );
}
