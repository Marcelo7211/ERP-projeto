import fs from 'fs';
import path from 'path';

// Helpers
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const generateId = (prefix) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

// Dictionaries
const firstNames = ['Ana', 'Bruno', 'Carlos', 'Daniela', 'Eduardo', 'Fernanda', 'Gabriel', 'Helena', 'Igor', 'Julia', 'Lucas', 'Mariana', 'Pedro', 'Rafael', 'Sofia'];
const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida'];
const streets = ['Rua das Flores', 'Av. Paulista', 'Rua Augusta', 'Av. Copacabana', 'Rua do Ouvidor', 'Av. Brasil', 'Rua da Consolação', 'Av. Ipiranga', 'Rua Oscar Freire', 'Av. Faria Lima'];
const neighborhoods = ['Centro', 'Jardins', 'Pinheiros', 'Moema', 'Vila Madalena', 'Itaim Bibi', 'Brooklin', 'Vila Mariana', 'Leblon', 'Ipanema'];
const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre', 'Brasília', 'Salvador', 'Fortaleza', 'Recife', 'Florianópolis'];

const propertyTypes = ['Casa', 'Apartamento', 'Cobertura', 'Comercial', 'Terreno'];
const propertyStatus = ['Disponível', 'Alugado', 'Vendido', 'Em Negociação'];

// Generate Properties (1000 items)
const properties = Array.from({ length: 1000 }, () => {
  const type = getRandomElement(propertyTypes);
  let price;
  if (type === 'Casa' || type === 'Cobertura') price = getRandomInt(800000, 5000000);
  else if (type === 'Apartamento') price = getRandomInt(300000, 2000000);
  else if (type === 'Comercial') price = getRandomInt(500000, 10000000);
  else price = getRandomInt(100000, 1000000);

  return {
    id: generateId('prop'),
    title: `${type} em ${getRandomElement(neighborhoods)}`,
    type,
    address: `${getRandomElement(streets)}, ${getRandomInt(10, 2000)} - ${getRandomElement(neighborhoods)}, ${getRandomElement(cities)}`,
    price,
    rentPrice: getRandomInt(1500, 15000),
    status: getRandomElement(propertyStatus),
    features: {
      bedrooms: type === 'Terreno' || type === 'Comercial' ? 0 : getRandomInt(1, 5),
      bathrooms: type === 'Terreno' ? 0 : getRandomInt(1, 4),
      parking: getRandomInt(0, 4),
      area: getRandomInt(40, 500)
    },
    createdAt: new Date(Date.now() - getRandomInt(0, 31536000000)).toISOString(), // Last 1 year
    image: `https://images.unsplash.com/photo-${getRandomElement(['1512917774080-9991f1c4c750', '1600596542815-ffad4c1539a9', '1564013799919-ab600027ffc6', '1484154218962-a197022b5858', '1580587771525-78b9dba3b914'])}?auto=format&fit=crop&q=80&w=600`
  };
});

// Generate Clients (500 items)
const clientTypes = ['Comprador', 'Vendedor', 'Locatário', 'Locador', 'Investidor'];
const clients = Array.from({ length: 500 }, () => ({
  id: generateId('cli'),
  name: `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`,
  type: getRandomElement(clientTypes),
  email: `${getRandomElement(firstNames).toLowerCase()}.${getRandomElement(lastNames).toLowerCase()}@example.com`,
  phone: `(11) 9${getRandomInt(1000, 9999)}-${getRandomInt(1000, 9999)}`,
  interest: {
    propertyType: getRandomElement(propertyTypes),
    maxPrice: getRandomInt(500000, 3000000)
  },
  createdAt: new Date(Date.now() - getRandomInt(0, 31536000000)).toISOString()
}));

// Generate Contracts (500 items)
const contractTypes = ['Venda', 'Aluguel'];
const contractStatus = ['Ativo', 'Finalizado', 'Cancelado', 'Em Análise'];
const contracts = Array.from({ length: 500 }, () => {
  const type = getRandomElement(contractTypes);
  const property = getRandomElement(properties);
  const client = getRandomElement(clients);
  const startDate = new Date(Date.now() - getRandomInt(0, 15768000000)); // Last 6 months
  
  let endDate = new Date(startDate);
  if (type === 'Aluguel') {
    endDate.setFullYear(endDate.getFullYear() + getRandomInt(1, 3));
  } else {
    endDate.setMonth(endDate.getMonth() + 1); // Venda process time
  }

  return {
    id: generateId('ctrt'),
    type,
    propertyId: property.id,
    clientId: client.id,
    value: type === 'Venda' ? property.price : property.rentPrice,
    status: getRandomElement(contractStatus),
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  };
});

// Save to files
const dataDir = path.join(process.cwd(), 'src/data');
fs.writeFileSync(path.join(dataDir, 'properties.json'), JSON.stringify(properties, null, 2));
fs.writeFileSync(path.join(dataDir, 'clients.json'), JSON.stringify(clients, null, 2));
fs.writeFileSync(path.join(dataDir, 'contracts.json'), JSON.stringify(contracts, null, 2));

console.log(`Generated ${properties.length} properties, ${clients.length} clients, and ${contracts.length} contracts.`);
