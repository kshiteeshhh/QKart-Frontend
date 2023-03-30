import { Search, SentimentDissatisfied } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import { createReturn } from "typescript";
import Cart, { generateCartItemsFrom } from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(0);
  const [completeData, setCompleteData] = useState([]);
  // const[cartData,setCartData]=useState([]);
  // const[cartData,setCartData]=useState([]);
  // const [productsFound, setProductsFound] = useState(true);
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setLoading(true);
    try {
      let resp = await axios.get(`${config.endpoint}/products`);
      setLoading(false);
      setProducts(resp.data);
      setFilteredProducts(resp.data);
      // setFilteredData(resp.data);
    } catch (e) {
      let obj = e.response;
      enqueueSnackbar(obj.data.message, { variant: "error" });
      setLoading(true);
    }
  };
  useEffect(() => {
      performAPICall();
          // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  useEffect(()=>{
    let token=localStorage.getItem('token');
  //   if(token)
   fetchCart(token)
    .then((resp)=>{
      // console.log(resp);
      let data=generateCartItemsFrom(resp,products);
      setCompleteData(data)
    })
    .catch((err)=>{return;})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[products])
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  async function performSearch(text) {
    try {
      let resp = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setFilteredProducts(resp.data);
    } catch (e) {
      let obj = e.response;
      if (obj.status === 404) {
        setFilteredProducts([]);
        // setFilteredData(data);
      } else if (obj.status === 500) {
        setFilteredProducts(products);
        //  setFilteredData([]);
        enqueueSnackbar(obj.message, { varian: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch the products. check that the backend is running, reachable and return valid JSON",
          { variant: "error" }
        );
      }
    }
  }
  // useEffect(() => {
  //   performSearch(searchTerm);
  // }, [searchTerm]);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  // function stringConversion(text)
  // {
  //   let arr=text.split(' ');
  //   let string=arr[0];
  //   for(let i=1;i<arr.length;i++)
  //   {
  //     string=string+'%20'+arr[i];
  //   }
  //   return string;
  // }
  const debounceSearch = (event, debounceTimeout) => {
    if (debounceTimeout !== 0) {
      clearTimeout(debounceTimeout);
    }
    let text = event.target.value;
    // let String=stringConversion(text);
    let newTimer = setTimeout(() => {
      performSearch(text);
    }, 500);
    setDebounceTimer(newTimer);
  };
  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;
    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      let resp = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // setCartData(resp.data);
      return resp.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i]._id === productId) {
        return true;
      }
    }
    return false;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if(!token)
    {
      enqueueSnackbar('Login to add an item to the Cart',{variant:'error'})
      return;
    }
    else if(options.preventDuplicate) 
    {
      if (isItemInCart(items, productId)) 
      {
        enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update quantity or remove item.",
          { variant: "error" }
        );
      } 
      else 
      {
        const response = await axios.post(
          `${config.endpoint}/cart`,
          { productId, qty },
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
          }
        );
        let arr=generateCartItemsFrom(response.data,products);
        setCompleteData(arr);
      }
    } 
    else 
    {
      const response = await axios.post(
        `${config.endpoint}/cart`,
        { productId, qty },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      );
      let arr=generateCartItemsFrom(response.data,products);
      setCompleteData(arr);
    }
  }

  /* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */
  /* Search view for mobiles */
  return (
    <>
      <Header hasHiddenAuthButtons={false}>
        <TextField
          className="search-desktop"
          size="small"
          style={{ width: 300 }}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(event) => {
            debounceSearch(event, debounceTimer);
          }}
        />
      </Header>
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(event) => {
          debounceSearch(event, debounceTimer);
        }}
      />
      <Grid container>
        <Grid item xs={12} md={localStorage.getItem("username") ? 9 : 12}>
          <Grid item className="product-grid">
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>
          </Grid>
          {loading && (
            <Box className="loading">
              <CircularProgress />
              <h5>Loading Products...</h5>
            </Box>
          )}
          {!loading && (
            <Grid container spacing={1.5} p={1.5}>
              {filteredProducts.length === 0 ? (
                <Box className="loading">
                  <SentimentDissatisfied />
                  <h2>No products found</h2>
                </Box>
              ) : (
                filteredProducts.map((item) => {
                  return (
                    <Grid key={item._id} item xs={6} md={3}>
                      <ProductCard
                        product={item}
                        handleAddToCart={() => {
                          addToCart(
                            localStorage.getItem("token"),
                            completeData,
                            products,
                            item._id,
                            1,
                            { preventDuplicate: true }
                          );
                        }}
                      />
                    </Grid>
                  );
                })
              )}
            </Grid>
          )}
        </Grid>
        {localStorage.getItem("username") ? (
          <Grid  bgcolor={"#E9F5E1"} item xs={12} md={3}>
            <Cart
              products={products}
              items={completeData}
              handleQuantity={addToCart}
            />
          </Grid>
        ) : null}
      </Grid>
      <Footer />
    </>
  );
};

export default Products;
