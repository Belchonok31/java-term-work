package ru.shop.footballShop.entites;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.LinkedList;
import java.util.List;

@Getter
@Setter
@ToString
@Entity
@RequiredArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

    String name;
    String description;
    String category;

    int price;


    @OneToMany(mappedBy = "product", cascade=CascadeType.ALL)
    List<ProductImage> images;

    @ManyToMany
    @JoinTable(name = "cart",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "customer_id"))
    List<Customer> customerList;

    @ManyToMany
    @JoinTable(name = "ordered_product",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "order_id"))
    private List<Order> orders;

    public void addToCart(Customer customer) {
        if (customerList == null)
            customerList = new LinkedList<>();
        customerList.add(customer);
    }

    public void addOrder(Order order) {
        if (order == null)
            orders = new LinkedList<>();
        orders.add(order);
    }

}
