package ru.shop.footballShop.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.shop.footballShop.dto.NewProductDTO;
import ru.shop.footballShop.dto.ProductDTO;
import ru.shop.footballShop.entites.Product;
import ru.shop.footballShop.errors.ProductNotFoundException;
import ru.shop.footballShop.mappers.ProductMapper;
import ru.shop.footballShop.services.ProductImageService;
import ru.shop.footballShop.services.ProductService;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final ProductService productService;
    private final ProductMapper productMapper = ProductMapper.INSTANCE;
    private final ProductImageService productImageService;

    @GetMapping("/products")
    public List<ProductDTO> getAll() {
        return productService.findAll().stream().
                map(productMapper::convertProductToProductDTO).collect(Collectors.toList());
    }

    @PostMapping("/products/add")
    public Product addProduct(@RequestBody NewProductDTO newProductDTO) {
        productService.save(productMapper.convertNewProductDTOToProduct(newProductDTO));
        return productService.findAll().get(productService.findAll().size()-1);
    }

    /**
     * POST - "/admin/products/del/{id}"
     * Метод удаления товара
     *
     *
     * @param id - id товара для удаления
     */

    @PostMapping("/products/del/{id}")
    public void delProduct(@PathVariable("id") int id) {
        productService.delete(id);
    }

    @PostMapping("/load_image/{id}")
    public void loadImage(@PathVariable("id") long productId, @RequestPart("file") MultipartFile file)
            throws IOException, ProductNotFoundException {
        productImageService.save(productId, file);
    }

}
