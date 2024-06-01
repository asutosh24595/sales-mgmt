import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Flex,
  Text,
  Checkbox,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import Select from "react-select";
import { mockProductData } from "../api/Products";

const ViewOrderForm = ({ sale }) => {
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => {
      return new Promise((resolve) => resolve(mockProductData));
    },
  });

  const { register, setValue, watch } = useForm({
    defaultValues: sale 
  });

  const selectedProducts = watch("products");

  const productSKUs = productsQuery.data?.map((product) => product);

  useEffect(() => {
    if (sale && sale.items && productSKUs) {
      selectedProducts.forEach((selectedProduct, index) => {
        const selectedProductSKUs = productSKUs.find(
          (product) => product.id === selectedProduct.value
        )?.skus;

        if (selectedProductSKUs) {
          selectedProductSKUs.forEach((sku) => {
            const matchingItem = sale.items.find((item) => {
              return item.skuId === String(sku.id);
            });
            if (matchingItem) {
              setValue(`items.${index}.${sku.id}.price`, matchingItem.price);
              setValue(
                `items.${index}.${sku.id}.quantity`,
                matchingItem.quantity
              );
            }
          });
        }
      });
    }
  }, [sale, productSKUs, selectedProducts, setValue]);

  

  if (!sale) {
    return <div>Loading...</div>;
  }

  const productOptions = productsQuery.data?.map((product) => ({
    label: product.name,
    value: product.id,
  }));

  return (
    <form p={4}>
      <VStack spacing={6}>
        <FormControl>
          <HStack>
            <FormControl>
              <FormLabel htmlFor="invoice_no">Invoice No</FormLabel>
              <Input
                id="invoice_no"
                {...register("invoice_no", {
                  required: "Invoice No is required",
                })}
                type="number"
                placeholder="Enter Invoice Number"
                disabled
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="invoice_date">Invoice Date</FormLabel>
              <Input
                id="invoice_date"
                type="date"
                {...register("invoice_date", {
                  required: "Invoice Date is required",
                })}
                disabled
              />
            </FormControl>
          </HStack>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="customer_name">Customer Name</FormLabel>
          <Input
            id="customer_name"
            {...register("customer_name")}
            type="text"
            placeholder="Enter Customer Name"
            isDisabled
          />
        </FormControl>

        <FormControl>
          <FormLabel>Products</FormLabel>
          <Select
            options={productOptions}
            value={selectedProducts}
            isMulti
            isSearchable
            noOptionsMessage={() => "No Product Found"}
            onChange={(selectedOptions) => {
              setValue("products", selectedOptions);
            }}
            isDisabled
          />
        </FormControl>

        <FormControl>
          <Accordion allowMultiple>
            {selectedProducts.length > 0 &&
              selectedProducts.map((selectedProduct, index) => {
                const selectedProductSKUs = productSKUs.find(
                  (product) => product.id === selectedProduct.value
                )?.skus;
                return (
                  selectedProductSKUs && (
                    <AccordionItem key={index} mb={4}>
                      <h2>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            {selectedProduct.label}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel py={8}>
                        {selectedProductSKUs.map((sku, skuIndex) => (
                          <Box
                            key={skuIndex}
                            rounded="md"
                            height={40}
                            shadow="md"
                            bg="white"
                            w="100%"
                            mb={4}
                          >
                            <Flex
                              height="100%"
                              direction="column"
                              justifyContent="flex-end"
                              gap={4}
                            >
                              <Flex
                                px={4}
                                mx={4}
                                justifyContent="space-between"
                                borderBottom="1px solid"
                                borderColor="gray.200"
                              >
                                <Text>
                                  {skuIndex + 1}. SKU {sku.id} ({sku.amount}
                                  {sku.unit})
                                </Text>
                                <Text
                                  bg="lightblue"
                                  rounded="md"
                                  p={2}
                                  fontSize="smaller"
                                >
                                  Rate: ₹ {sku.selling_price}
                                </Text>
                              </Flex>
                              <HStack spacing={10} p={4}>
                                <FormControl>
                                  <FormLabel
                                    htmlFor={`items.${index}.${sku.id}.price`}
                                  >
                                    Selling Rate
                                  </FormLabel>
                                  <Input
                                    {...register(
                                      `items.${index}.${sku.id}.price`,
                                      {
                                        required: "Price is required",
                                      }
                                    )}
                                    id={`items.${index}.${sku.id}.price`}
                                    placeholder="Enter selling rate"
                                    value={
                                      sale &&
                                      sale.items &&
                                      sale.items.find(
                                        (item) => item.skuId === sku.id
                                      )?.price
                                    }
                                    type="number"
                                    disabled
                                  />
                                </FormControl>

                                <FormControl>
                                  <FormLabel
                                    htmlFor={`items.${index}.${sku.id}.quantity`}
                                  >
                                    Total Items
                                  </FormLabel>
                                  <Input
                                    {...register(
                                      `items.${index}.${sku.id}.quantity`,
                                      {
                                        required: "Quantity is required",
                                      }
                                    )}
                                    id={`items.${index}.${sku.id}.quantity`}
                                    placeholder="Enter quantity"
                                    type="number"
                                    disabled
                                  />
                                </FormControl>
                              </HStack>
                            </Flex>
                          </Box>
                        ))}
                      </AccordionPanel>
                    </AccordionItem>
                  )
                );
              })}
          </Accordion>
        </FormControl>

        <Flex width="100%" justifyContent="space-between">
          <Checkbox {...register("paid")} disabled>
            Paid
          </Checkbox>
        </Flex>
      </VStack>
    </form>
  );
};

export default ViewOrderForm;
