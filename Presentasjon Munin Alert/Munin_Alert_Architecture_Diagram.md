```mermaid
graph TD
    A[Mobile/Web Client] -->|HTTP Requests| B[Spring Boot Backend]
    A -->|WebSocket| B
    
    B -->|Store/Retrieve Data| C[(MongoDB)]
    
    subgraph "Backend Services"
        B --> D[User Service]
        B --> E[Alert Service]
        B --> F[Group Service]
        B --> G[Event Service]
        B --> H[Safe Haven Service]
        B --> I[Risk Alert Service]
        B --> J[WebSocket Service]
    end
    
    subgraph "Security Layer"
        B --> K[JWT Authentication]
        B --> L[Role-Based Access Control]
    end
    
    M[External Emergency Services] <-->|API Integration| B
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px
    style M fill:#fbb,stroke:#333,stroke-width:2px
```

You can use this Mermaid diagram in your presentation by:
1. Installing the Mermaid extension in your presentation tool
2. Or converting it to an image using the Mermaid Live Editor (https://mermaid.live/)
3. Or recreating it using PowerPoint shapes and connectors