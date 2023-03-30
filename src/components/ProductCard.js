import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia height='250' image={product.image} component='img' />
      <CardContent>
        <Typography variant="h5" mt={1} mb={1}>
          {product.name}
        </Typography>
        <Typography variant="h6" mt={1} mb={1}>
          ${product.cost}
        </Typography>
        <Rating name="half-rating" value={product.rating} readOnly />
      </CardContent>
      {/* <CardActions> */}
      <Button variant="contained" mb={1} startIcon={<AddShoppingCartOutlined/>} className='card-button card-actions' onClick={handleAddToCart}>ADD TO CART</Button>
    </Card>
  );
};

export default ProductCard;
