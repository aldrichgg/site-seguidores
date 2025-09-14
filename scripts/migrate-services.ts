// Script para migrar serviços do código para a API
// Dados extraídos exatamente do Index.tsx
const services = [
  // Instagram Seguidores
  {
    name: "200 Seguidores",
    platform: "instagram",
    serviceType: "seguidores",
    quantity: 200,
    price: 19.90,
    originalPrice: 29.90,
    features: [
      "Contas reais e ativas",
      "Entrega gradual e natural",
      "Garantia de reposição",
      "Suporte prioritário"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "24 horas",
    serviceId: 597,
    sortOrder: 1
  },
  {
    name: "500 Seguidores",
    platform: "instagram",
    serviceType: "seguidores",
    quantity: 500,
    price: 28.90,
    originalPrice: 48.90,
    features: [
      "Contas reais e ativas",
      "Entrega gradual e natural",
      "Garantia de reposição",
      "Suporte prioritário"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "24 horas",
    serviceId: 597,
    sortOrder: 2
  },
  {
    name: "1.000 Seguidores",
    platform: "instagram",
    serviceType: "seguidores",
    quantity: 1000,
    price: 47.30,
    originalPrice: 83.90,
    features: [
      "Contas reais e ativas",
      "Entrega gradual e natural",
      "Garantia de reposição",
      "Suporte prioritário"
    ],
    isPopular: true,
    isRecommended: false,
    deliveryTime: "24 horas",
    serviceId: 597,
    sortOrder: 3
  },
  {
    name: "2.000 Seguidores",
    platform: "instagram",
    serviceType: "seguidores",
    quantity: 2000,
    price: 53.70,
    originalPrice: 99.90,
    features: [
      "Contas reais e ativas",
      "Entrega gradual e natural",
      "Garantia de reposição",
      "Suporte prioritário"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "24 horas",
    serviceId: 597,
    sortOrder: 4
  },
  {
    name: "5.000 Seguidores",
    platform: "instagram",
    serviceType: "seguidores",
    quantity: 5000,
    price: 139.90,
    originalPrice: 179.90,
    features: [
      "Contas reais e ativas",
      "Entrega gradual e natural",
      "Garantia de reposição",
      "Suporte prioritário"
    ],
    isPopular: false,
    isRecommended: true,
    deliveryTime: "24 horas",
    serviceId: 597,
    sortOrder: 5
  },
  {
    name: "10.000 Seguidores",
    platform: "instagram",
    serviceType: "seguidores",
    quantity: 10000,
    price: 239.90,
    originalPrice: 283.70,
    features: [
      "Contas reais e ativas",
      "Entrega gradual e natural",
      "Garantia de reposição",
      "Suporte prioritário"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "24 horas",
    serviceId: 597,
    sortOrder: 6
  },

  // Instagram Curtidas
  {
    name: "200 Curtidas",
    platform: "instagram",
    serviceType: "curtidas",
    quantity: 200,
    price: 3.00,
    originalPrice: 4.90,
    features: [
      "Curtidas 100% reais",
      "Entrega imediata",
      "Aumento de engajamento",
      "Suporte 24/7"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "Imediato",
    serviceId: 598,
    sortOrder: 1
  },
  {
    name: "400 Curtidas",
    platform: "instagram",
    serviceType: "curtidas",
    quantity: 400,
    price: 3.50,
    originalPrice: 6.90,
    features: [
      "Curtidas 100% reais",
      "Entrega imediata",
      "Aumento de engajamento",
      "Suporte 24/7"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "Imediato",
    serviceId: 598,
    sortOrder: 2
  },
  {
    name: "600 Curtidas",
    platform: "instagram",
    serviceType: "curtidas",
    quantity: 600,
    price: 5.50,
    originalPrice: 9.90,
    features: [
      "Curtidas 100% reais",
      "Entrega imediata",
      "Aumento de engajamento",
      "Suporte 24/7"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "Imediato",
    serviceId: 598,
    sortOrder: 3
  },
  {
    name: "1.000 Curtidas",
    platform: "instagram",
    serviceType: "curtidas",
    quantity: 1000,
    price: 10.00,
    originalPrice: 18.90,
    features: [
      "Curtidas 100% reais",
      "Entrega imediata",
      "Aumento de engajamento",
      "Suporte 24/7"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "Imediato",
    serviceId: 598,
    sortOrder: 4
  },
  {
    name: "2.000 Curtidas",
    platform: "instagram",
    serviceType: "curtidas",
    quantity: 2000,
    price: 18.00,
    originalPrice: 29.90,
    features: [
      "Curtidas 100% reais",
      "Entrega imediata",
      "Aumento de engajamento",
      "Suporte 24/7"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "Imediato",
    serviceId: 598,
    sortOrder: 5
  },
  {
    name: "6.000 Curtidas",
    platform: "instagram",
    serviceType: "curtidas",
    quantity: 6000,
    price: 35.00,
    originalPrice: 59.90,
    features: [
      "Curtidas 100% reais",
      "Entrega imediata",
      "Aumento de engajamento",
      "Suporte 24/7"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "Imediato",
    serviceId: 598,
    sortOrder: 6
  },

  // Instagram Visualizações
  {
    name: "500 Visualizações",
    platform: "instagram",
    serviceType: "visualizacoes",
    quantity: 500,
    price: 3.00,
    originalPrice: 5.90,
    features: [
      "Visualizações de qualidade",
      "Entrega rápida",
      "Impulsiona algoritmo",
      "Maior alcance"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "Rápido",
    serviceId: 250,
    sortOrder: 1
  },
  {
    name: "1.000 Visualizações",
    platform: "instagram",
    serviceType: "visualizacoes",
    quantity: 1000,
    price: 6.00,
    originalPrice: 9.90,
    features: [
      "Visualizações de qualidade",
      "Entrega rápida",
      "Impulsiona algoritmo",
      "Maior alcance"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "Rápido",
    serviceId: 250,
    sortOrder: 2
  },
  {
    name: "3.000 Visualizações",
    platform: "instagram",
    serviceType: "visualizacoes",
    quantity: 3000,
    price: 16.00,
    originalPrice: 24.90,
    features: [
      "Visualizações de qualidade",
      "Entrega rápida",
      "Impulsiona algoritmo",
      "Maior alcance"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "Rápido",
    serviceId: 250,
    sortOrder: 3
  },
  {
    name: "5.000 Visualizações",
    platform: "instagram",
    serviceType: "visualizacoes",
    quantity: 5000,
    price: 25.00,
    originalPrice: 39.90,
    features: [
      "Visualizações de qualidade",
      "Entrega rápida",
      "Impulsiona algoritmo",
      "Maior alcance"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "Rápido",
    serviceId: 250,
    sortOrder: 4
  },
  {
    name: "10.000 Visualizações",
    platform: "instagram",
    serviceType: "visualizacoes",
    quantity: 10000,
    price: 50.00,
    originalPrice: 79.90,
    features: [
      "Visualizações de qualidade",
      "Entrega rápida",
      "Impulsiona algoritmo",
      "Maior alcance"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "Rápido",
    serviceId: 250,
    sortOrder: 5
  },
  {
    name: "30.000 Visualizações",
    platform: "instagram",
    serviceType: "visualizacoes",
    quantity: 30000,
    price: 130.00,
    originalPrice: 199.90,
    features: [
      "Visualizações de qualidade",
      "Entrega rápida",
      "Impulsiona algoritmo",
      "Maior alcance"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "Rápido",
    serviceId: 250,
    sortOrder: 6
  },

  // YouTube Inscritos
  {
    name: "1.000 Inscritos",
    platform: "youtube",
    serviceType: "inscritos",
    quantity: 1000,
    price: 180.00,
    originalPrice: 250.00,
    features: [
      "Inscritos reais e ativos",
      "Entrega gradual",
      "Permanência garantida",
      "Impulsiona algoritmo"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "24-48 horas",
    serviceId: 601,
    sortOrder: 1
  },
  {
    name: "3.000 Inscritos",
    platform: "youtube",
    serviceType: "inscritos",
    quantity: 3000,
    price: 540.00,
    originalPrice: 700.00,
    features: [
      "Inscritos reais e ativos",
      "Entrega gradual",
      "Permanência garantida",
      "Impulsiona algoritmo"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "24-48 horas",
    serviceId: 601,
    sortOrder: 2
  },
  {
    name: "5.000 Inscritos",
    platform: "youtube",
    serviceType: "inscritos",
    quantity: 5000,
    price: 900.00,
    originalPrice: 1200.00,
    features: [
      "Inscritos reais e ativos",
      "Entrega gradual",
      "Permanência garantida",
      "Impulsiona algoritmo"
    ],
    isPopular: true,
    isRecommended: false,
    deliveryTime: "24-48 horas",
    serviceId: 601,
    sortOrder: 3
  },
  {
    name: "10.000 Inscritos",
    platform: "youtube",
    serviceType: "inscritos",
    quantity: 10000,
    price: 1800.00,
    originalPrice: 2300.00,
    features: [
      "Inscritos reais e ativos",
      "Entrega gradual",
      "Permanência garantida",
      "Impulsiona algoritmo"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "24-48 horas",
    serviceId: 601,
    sortOrder: 4
  },
  {
    name: "30.000 Inscritos",
    platform: "youtube",
    serviceType: "inscritos",
    quantity: 30000,
    price: 5400.00,
    originalPrice: 6800.00,
    features: [
      "Inscritos reais e ativos",
      "Entrega gradual",
      "Permanência garantida",
      "Impulsiona algoritmo"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "24-48 horas",
    serviceId: 601,
    sortOrder: 5
  },
  {
    name: "100.000 Inscritos",
    platform: "youtube",
    serviceType: "inscritos",
    quantity: 100000,
    price: 12600.00,
    originalPrice: 16000.00,
    features: [
      "Inscritos reais e ativos",
      "Entrega gradual",
      "Permanência garantida",
      "Impulsiona algoritmo"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "24-48 horas",
    serviceId: 601,
    sortOrder: 6
  },

  // YouTube Curtidas
  {
    name: "1.000 Curtidas",
    platform: "youtube",
    serviceType: "curtidas",
    quantity: 1000,
    price: 25.00,
    originalPrice: 39.90,
    features: [
      "Curtidas reais e permanentes",
      "Aumento na popularidade",
      "Entrega gradual",
      "Impulsiona algoritmo"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "24 horas",
    serviceId: 602,
    sortOrder: 1
  },
  {
    name: "3.000 Curtidas",
    platform: "youtube",
    serviceType: "curtidas",
    quantity: 3000,
    price: 75.00,
    originalPrice: 99.90,
    features: [
      "Curtidas reais e permanentes",
      "Aumento na popularidade",
      "Entrega gradual",
      "Impulsiona algoritmo"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "24 horas",
    serviceId: 602,
    sortOrder: 2
  },
  {
    name: "5.000 Curtidas",
    platform: "youtube",
    serviceType: "curtidas",
    quantity: 5000,
    price: 125.00,
    originalPrice: 169.90,
    features: [
      "Curtidas reais e permanentes",
      "Aumento na popularidade",
      "Entrega gradual",
      "Impulsiona algoritmo"
    ],
    isPopular: true,
    isRecommended: false,
    deliveryTime: "24 horas",
    serviceId: 602,
    sortOrder: 3
  },
  {
    name: "6.000 Curtidas",
    platform: "youtube",
    serviceType: "curtidas",
    quantity: 6000,
    price: 150.00,
    originalPrice: 199.90,
    features: [
      "Curtidas reais e permanentes",
      "Aumento na popularidade",
      "Entrega gradual",
      "Impulsiona algoritmo"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "24 horas",
    serviceId: 602,
    sortOrder: 4
  },
  {
    name: "9.000 Curtidas",
    platform: "youtube",
    serviceType: "curtidas",
    quantity: 9000,
    price: 225.00,
    originalPrice: 289.90,
    features: [
      "Curtidas reais e permanentes",
      "Aumento na popularidade",
      "Entrega gradual",
      "Impulsiona algoritmo"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "24 horas",
    serviceId: 602,
    sortOrder: 5
  },
  {
    name: "10.000 Curtidas",
    platform: "youtube",
    serviceType: "curtidas",
    quantity: 10000,
    price: 250.00,
    originalPrice: 329.90,
    features: [
      "Curtidas reais e permanentes",
      "Aumento na popularidade",
      "Entrega gradual",
      "Impulsiona algoritmo"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "24 horas",
    serviceId: 602,
    sortOrder: 6
  },

  // TikTok Seguidores
  {
    name: "100 Seguidores",
    platform: "tiktok",
    serviceType: "seguidores",
    quantity: 100,
    price: 9.97,
    originalPrice: 15.00,
    features: [
      "Seguidores de alta qualidade",
      "Entrega gradual",
      "Reposição garantida",
      "Suporte 24/7"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "24 horas",
    serviceId: 396,
    sortOrder: 1
  },
  {
    name: "400 Seguidores",
    platform: "tiktok",
    serviceType: "seguidores",
    quantity: 400,
    price: 39.88,
    originalPrice: 59.90,
    features: [
      "Seguidores de alta qualidade",
      "Entrega gradual",
      "Reposição garantida",
      "Suporte 24/7"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "24 horas",
    serviceId: 396,
    sortOrder: 2
  },
  {
    name: "1.000 Seguidores",
    platform: "tiktok",
    serviceType: "seguidores",
    quantity: 1000,
    price: 99.70,
    originalPrice: 149.90,
    features: [
      "Seguidores de alta qualidade",
      "Entrega gradual",
      "Reposição garantida",
      "Suporte 24/7"
    ],
    isPopular: true,
    isRecommended: false,
    deliveryTime: "24 horas",
    serviceId: 396,
    sortOrder: 3
  },
  {
    name: "2.000 Seguidores",
    platform: "tiktok",
    serviceType: "seguidores",
    quantity: 2000,
    price: 199.40,
    originalPrice: 299.00,
    features: [
      "Seguidores de alta qualidade",
      "Entrega gradual",
      "Reposição garantida",
      "Suporte 24/7"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "24 horas",
    serviceId: 396,
    sortOrder: 4
  },
  {
    name: "4.000 Seguidores",
    platform: "tiktok",
    serviceType: "seguidores",
    quantity: 4000,
    price: 398.80,
    originalPrice: 597.00,
    features: [
      "Seguidores de alta qualidade",
      "Entrega gradual",
      "Reposição garantida",
      "Suporte 24/7"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "24 horas",
    serviceId: 396,
    sortOrder: 5
  },
  {
    name: "10.000 Seguidores",
    platform: "tiktok",
    serviceType: "seguidores",
    quantity: 10000,
    price: 997.00,
    originalPrice: 1490.00,
    features: [
      "Seguidores de alta qualidade",
      "Entrega gradual",
      "Reposição garantida",
      "Suporte 24/7"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "24 horas",
    serviceId: 396,
    sortOrder: 6
  },

  // TikTok Curtidas
  {
    name: "100 Curtidas",
    platform: "tiktok",
    serviceType: "curtidas",
    quantity: 100,
    price: 10.00,
    originalPrice: 15.00,
    features: [
      "Curtidas reais",
      "Entrega rápida",
      "Aumento no alcance",
      "Melhora popularidade"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "Rápido",
    serviceId: 50,
    sortOrder: 1
  },
  {
    name: "400 Curtidas",
    platform: "tiktok",
    serviceType: "curtidas",
    quantity: 400,
    price: 16.00,
    originalPrice: 24.90,
    features: [
      "Curtidas reais",
      "Entrega rápida",
      "Aumento no alcance",
      "Melhora popularidade"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "Rápido",
    serviceId: 50,
    sortOrder: 2
  },
  {
    name: "1.000 Curtidas",
    platform: "tiktok",
    serviceType: "curtidas",
    quantity: 1000,
    price: 18.00,
    originalPrice: 29.90,
    features: [
      "Curtidas reais",
      "Entrega rápida",
      "Aumento no alcance",
      "Melhora popularidade"
    ],
    isPopular: true,
    isRecommended: false,
    deliveryTime: "Rápido",
    serviceId: 50,
    sortOrder: 3
  },
  {
    name: "4.000 Curtidas",
    platform: "tiktok",
    serviceType: "curtidas",
    quantity: 4000,
    price: 35.00,
    originalPrice: 59.90,
    features: [
      "Curtidas reais",
      "Entrega rápida",
      "Aumento no alcance",
      "Melhora popularidade"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "Rápido",
    serviceId: 50,
    sortOrder: 4
  },
  {
    name: "10.000 Curtidas",
    platform: "tiktok",
    serviceType: "curtidas",
    quantity: 10000,
    price: 91.00,
    originalPrice: 139.90,
    features: [
      "Curtidas reais",
      "Entrega rápida",
      "Aumento no alcance",
      "Melhora popularidade"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "Rápido",
    serviceId: 50,
    sortOrder: 5
  },
  {
    name: "30.000 Curtidas",
    platform: "tiktok",
    serviceType: "curtidas",
    quantity: 30000,
    price: 170.00,
    originalPrice: 259.90,
    features: [
      "Curtidas reais",
      "Entrega rápida",
      "Aumento no alcance",
      "Melhora popularidade"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "Rápido",
    serviceId: 50,
    sortOrder: 6
  },

  // TikTok Visualizações
  {
    name: "1.000 Visualizações",
    platform: "tiktok",
    serviceType: "visualizacoes",
    quantity: 1000,
    price: 14.90,
    originalPrice: 19.90,
    features: [
      "Visualizações de alta qualidade",
      "Entrega rápida",
      "Aumento no alcance",
      "Melhora posicionamento"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "Rápido",
    serviceId: 334,
    sortOrder: 1
  },
  {
    name: "5.000 Visualizações",
    platform: "tiktok",
    serviceType: "visualizacoes",
    quantity: 5000,
    price: 49.90,
    originalPrice: 69.90,
    features: [
      "Visualizações de alta qualidade",
      "Entrega rápida",
      "Aumento no alcance",
      "Melhora posicionamento"
    ],
    isPopular: true,
    isRecommended: false,
    deliveryTime: "Rápido",
    serviceId: 334,
    sortOrder: 2
  },
  {
    name: "10.000 Visualizações",
    platform: "tiktok",
    serviceType: "visualizacoes",
    quantity: 10000,
    price: 89.90,
    originalPrice: 119.90,
    features: [
      "Visualizações de alta qualidade",
      "Entrega rápida",
      "Aumento no alcance",
      "Melhora posicionamento"
    ],
    isPopular: false,
    isRecommended: false,
    deliveryTime: "Rápido",
    serviceId: 334,
    sortOrder: 3
  }
];

async function migrateServices() {
  const API_BASE_URL = 'http://localhost:3000/services';
  
  console.log('🚀 Iniciando migração de serviços...');
  console.log(`📊 Total de serviços para migrar: ${services.length}`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const service of services) {
    try {
      console.log(`\n📤 Migrando: ${service.name}...`);
      
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(service)
      });
      
      if (response.ok) {
        const createdService = await response.json();
        console.log(`✅ Sucesso: ${service.name} (ID: ${createdService.id})`);
        successCount++;
      } else {
        const errorData = await response.text();
        console.error(`❌ Erro ao migrar ${service.name}:`, errorData);
        errorCount++;
      }
    } catch (error) {
      console.error(`❌ Erro ao migrar ${service.name}:`, error.message);
      errorCount++;
    }
    
    // Pequena pausa entre as requisições
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n🎉 Migração concluída!');
  console.log(`✅ Sucessos: ${successCount}`);
  console.log(`❌ Erros: ${errorCount}`);
  console.log(`📊 Total processado: ${successCount + errorCount}`);
  
  if (errorCount > 0) {
    console.log('\n⚠️  Alguns serviços falharam na migração. Verifique os erros acima.');
  } else {
    console.log('\n🎊 Todos os serviços foram migrados com sucesso!');
  }
}

// Executar migração
migrateServices().catch(console.error);