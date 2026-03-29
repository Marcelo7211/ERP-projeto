import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    burst_1000: {
      executor: 'constant-vus',
      vus: 1000,
      duration: '30s'
    }
  },
  thresholds: {
    http_req_failed: ['rate<0.03'],
    http_req_duration: ['p(95)<1200']
  }
};

const baseUrl = __ENV.BASE_URL || 'http://localhost:5288';
const email = __ENV.LOGIN_EMAIL || 'usuario1@imobiliariapro.com.br';
const password = __ENV.LOGIN_PASSWORD || 'Senha@123';

function login() {
  const payload = JSON.stringify({ email, password });
  const headers = { 'Content-Type': 'application/json' };
  const response = http.post(`${baseUrl}/api/auth/login`, payload, { headers });
  const success = check(response, { 'login status 200': (r) => r.status === 200 });
  if (!success) {
    return '';
  }

  const body = response.json();
  return body.token;
}

export default function () {
  const token = login();
  check(token, { 'token preenchido': (t) => t && t.length > 10 });

  const authHeaders = { Authorization: `Bearer ${token}` };
  const requests = [
    ['GET', `${baseUrl}/api/clients?page=1&pageSize=20`, null, { headers: authHeaders }],
    ['GET', `${baseUrl}/api/properties?page=1&pageSize=20`, null, { headers: authHeaders }],
    ['GET', `${baseUrl}/api/contracts?page=1&pageSize=20`, null, { headers: authHeaders }],
    ['GET', `${baseUrl}/api/pipeline?page=1&pageSize=20`, null, { headers: authHeaders }],
    ['GET', `${baseUrl}/api/dashboard/summary`, null, { headers: authHeaders }]
  ];

  const responses = http.batch(requests);
  for (const response of responses) {
    check(response, { 'status 200': (r) => r.status === 200 });
  }

  sleep(1);
}
