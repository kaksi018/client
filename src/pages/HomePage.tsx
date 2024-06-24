import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ProductType {
  id: string;
  name: string;
  explanation: string;
  price: number;
}
interface ProductItemProps {
  product: ProductType;
  onDelete: (id: string) => void;
  onUpdate: (product: ProductType) => void;
}

const ProductItem = ({ product, onDelete, onUpdate }: ProductItemProps) => {
  const { id, name, explanation, price } = product;
  const [isEditMode, setIsEditMode] = useState(false);
  const [editName, setEditName] = useState(product.name);
  const [editExplanation, setEditExplanation] = useState(product.explanation);
  const [editPrice, setEditPrice] = useState(product.price);

  return (
    <div>
      <div>{id}</div>
      <div>
        <Link to={`/${id}`}>{name}</Link>
      </div>
      <div>{price}</div>
      <div>{explanation}</div>

      <button type="button" onClick={() => onDelete(id)}>
        삭제하기
      </button>
      <button type="button" onClick={() => setIsEditMode((prev) => !prev)}>
        수정하기
      </button>

      {isEditMode && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onUpdate({
              id,
              name: editName,
              price: editPrice,
              explanation: editExplanation,
            });
          }}
        >
          <input
            type="text"
            placeholder="상품이름"
            value={editName}
            onChange={(event) => setEditName(event.target.value)}
          />
          <textarea
            rows={5}
            placeholder="상품설명"
            value={editExplanation}
            onChange={(event) => setEditExplanation(event.target.value)}
          />
          <input
            type="number"
            placeholder="상품가격"
            value={editPrice}
            onChange={(event) => setEditPrice(parseInt(event.target.value, 10))}
          />

          <input type="submit" value="상품수정하기" />
        </form>
      )}
    </div>
  );
};
const HomePage = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [name, setName] = useState("");
  const [explanation, setExplanation] = useState("");
  const [price, setPrice] = useState(0);

  const handleCreate = (newProduct: Omit<ProductType, "id">) => {
    fetch(`/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    })
      .then((response) => response.json())
      .then((data) => {
        setProducts((prev) => [...prev, data.product]);
      });
  };

  const handleDelete = (id: string) => {
    fetch(`/product/${id}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok) {
        setProducts(products.filter((product) => product.id !== id));
      }
    });
  };

  const handleUpdate = (updateProduct: ProductType) => {
    fetch(`/product/${updateProduct.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateProduct),
    }).then((response) => {
      if (response.ok) {
        setProducts(
          products.map((product) =>
            product.id === updateProduct.id ? updateProduct : product
          )
        );
      }
    });
  };

  useEffect(() => {
    fetch(`/product`)
      .then((response) => response.json())
      .then((data) => setProducts(data.products));
  }, []);

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleCreate({
            name,
            explanation,
            price,
          });
        }}
      >
        <input
          type="text"
          placeholder="상품이름"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <textarea
          rows={5}
          placeholder="상품설명"
          value={name}
          onChange={(event) => setExplanation(event.target.value)}
        />
        <input
          type="number"
          placeholder="상품가격"
          value={name}
          onChange={(event) => setPrice(parseInt(event.target.value, 10))}
        />
        <input type="submit" value="상품등록" />
      </form>

      {products.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}
    </>
  );
};

export default HomePage;
