import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
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
import { customer } from "../api/Customer";
import { mockProductData } from "../api/Products";

const SaleOrderForm = ({ onSubmit, defaultValues }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["customer"],
    queryFn: () => {
      return new Promise((resolve) => resolve(customer));
    },
  });

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => {
      return new Promise((resolve) => resolve(mockProductData));
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: defaultValues || {
      customer_name: "",
      invoice_date: "",
      invoice_no: "",
      products: [],
      items: [],
      paid: false,
    },
  });

  const selectedProducts = watch("products");

  const handleFormSubmit = (data) => {
    const flattenedItems = [];
    Object.keys(data.items).forEach((productIndex) => {
      Object.keys(data.items[productIndex]).forEach((skuId) => {
        const price = data.items[productIndex][skuId].price || 0;
        const quantity = data.items[productIndex][skuId].quantity || 0;
        flattenedItems.push({
          skuId,
          price,
          quantity,
        });
      });
    });
    data.items = flattenedItems;

    reset();
    onSubmit(data);
  };

  if (isLoading || productsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (error || productsQuery.error) {
    return <div>Error loading data</div>;
  }

  const productOptions = productsQuery.data?.map((product) => ({
    label: product.name,
    value: product.id,
  }));

  const customerOptions = data.map((customer) => ({
    label: customer.customer_profile.name,
    value: customer.customer_profile.id,
    id: customer.id,
  }));

  const productSKUs = productsQuery.data?.map((product) => product);

  return (
    <form p={4} onSubmit={handleSubmit(handleFormSubmit)}>
      <VStack spacing={6}>
        <FormControl>
          <HStack>
            <FormControl isInvalid={errors.invoice_no}>
              <FormLabel htmlFor="invoice_no">Invoice No</FormLabel>
              <Input
                id="invoice_no"
                {...register("invoice_no", {
                  required: "Invoice No is required",
                })}
                type="number"
                placeholder="Enter Invoice Number"
              />
              {errors.invoice_no && (
                <FormErrorMessage>{errors.invoice_no.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={errors.invoice_date}>
              <FormLabel htmlFor="invoice_date">Invoice Date</FormLabel>
              <Input
                id="invoice_date"
                type="date"
                {...register("invoice_date", {
                  required: "Invoice Date is required",
                })}
              />
              {errors.invoice_date && (
                <FormErrorMessage>
                  {errors.invoice_date.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </HStack>
        </FormControl>

        <FormControl isInvalid={errors.customer_name}>
          <FormLabel htmlFor="customer_name">Customer Name</FormLabel>
          <Select
            styles={{
              option: (baseStyles, state) => ({
                ...baseStyles,
                color: "black",
              }),
            }}
            name="customer_name"
            options={customerOptions}
            value={customerOptions.find(
              (option) => option.value === watch("customer_name")
            )}
            onChange={(selectedOption) => {
              setValue("customer_name", selectedOption.label);
              setValue("customer_id", selectedOption.id);
            }}
            required
          />
        </FormControl>

        <FormControl isInvalid={errors.products}>
          <FormLabel>Products</FormLabel>
          <Select
            styles={{
              option: (baseStyles, state) => ({
                ...baseStyles,
                color: "black",
              }),
            }}
            options={productOptions}
            value={selectedProducts}
            isMulti
            isSearchable
            isClearable
            noOptionsMessage={() => "No Product Found"}
            onChange={(selectedOptions) => {
              setValue("products", selectedOptions);
            }}
            required
          />

          {errors.products && (
            <FormErrorMessage>{errors.products.message}</FormErrorMessage>
          )}
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
                            color="black"
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
                                <FormControl
                                  isInvalid={
                                    errors.items?.[index]?.[sku.id]?.price
                                  }
                                >
                                  <FormLabel
                                    htmlFor={`items.${index}.${sku.id}.price`}
                                  >
                                    Selling Rate
                                  </FormLabel>
                                  <Input
                                    {...register(
                                      `items.${index}.${sku.id}.price`,
                                      {
                                        required:
                                          sku.quantity_in_inventory !== 0 &&
                                          "Price is required",
                                      }
                                    )}
                                    id={`items.${index}.${sku.id}.price`}
                                    placeholder="Enter selling rate"
                                    type="number"
                                    disabled={sku.quantity_in_inventory === 0}
                                  />
                                  <FormErrorMessage>
                                    {
                                      errors.items?.[index]?.[sku.id]?.price
                                        ?.message
                                    }
                                  </FormErrorMessage>
                                </FormControl>

                                <FormControl
                                  isInvalid={
                                    errors.items?.[index]?.[sku.id]?.quantity
                                  }
                                >
                                  <FormLabel
                                    htmlFor={`items.${index}.${sku.id}.quantity`}
                                  >
                                    Total Items
                                  </FormLabel>
                                  <Input
                                    {...register(
                                      `items.${index}.${sku.id}.quantity`,
                                      {
                                        required:
                                          sku.quantity_in_inventory !== 0 &&
                                          "Quantity is required",
                                        validate: (value) => {
                                          const quantityEntered =
                                            parseInt(value) || 0;
                                          const remainingItems =
                                            sku.quantity_in_inventory;
                                          return (
                                            quantityEntered <= remainingItems ||
                                            `Quantity exceeds available items (${remainingItems} remaining)`
                                          );
                                        },
                                      }
                                    )}
                                    id={`items.${index}.${sku.id}.quantity`}
                                    placeholder="Enter quantity"
                                    type="number"
                                    disabled={sku.quantity_in_inventory === 0}
                                  />
                                  <Text
                                    bg="lightgreen"
                                    rounded="md"
                                    textAlign="center"
                                    fontSize="x-small"
                                    position="absolute"
                                    bottom="-3"
                                    right="0"
                                    p={1}
                                  >
                                    {sku.quantity_in_inventory === 0
                                      ? "No Items Remaining"
                                      : `${sku.quantity_in_inventory} ${
                                          sku.quantity_in_inventory === 1
                                            ? "Item"
                                            : "Items"
                                        } Remaining`}
                                  </Text>

                                  {errors.items?.[index]?.[sku.id]
                                    ?.quantity && (
                                    <FormErrorMessage>
                                      {
                                        errors.items[index][sku.id].quantity
                                          .message
                                      }
                                    </FormErrorMessage>
                                  )}
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
          <Checkbox disabled>Paid</Checkbox>
          <Button type="submit" colorScheme="teal">
            Submit
          </Button>
        </Flex>
      </VStack>
    </form>
  );
};

export default SaleOrderForm;
