package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type OrderItem struct {
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Quantity    int     `json:"quantity"`
}

type OrderRequest struct {
	Items []OrderItem `json:"items"`
}

type OrderResponse struct {
	Total float64 `json:"total"`
	Tax   float64 `json:"tax"`
}

func calculateOrder(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var order OrderRequest
	err := json.NewDecoder(r.Body).Decode(&order)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var total float64
	for _, item := range order.Items {
		total += item.Price * float64(item.Quantity)
	}

	tax := total * 0.1

	response := OrderResponse{
		Total: total,
		Tax:   tax,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func main() {
	http.HandleFunc("/calculate-order", calculateOrder)
	fmt.Println("Go service running at http://localhost:8081")
	http.ListenAndServe(":8081", nil)
}
