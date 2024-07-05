// path: frontend/src/main.js
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import './styles.css';

const app = document.getElementById('app');

app.innerHTML = `
  <div class="header">
    <div class="title-container">
      <h1>Stock Fight</h1>
      <button id="toggle-theme" type="button" class="theme-toggle">
        <svg id="toggle-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
          <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z"></path>
        </svg>
      </button>
    </div>
    <div class="subtitle-container">
      <h2>The <span class="highlight">best rated</span> stock fight on the market</h2>
      <h3>Where stocks come to fight</h3>
    </div>
    <form id="stock-form" class="form-container">
      <input id="stock1-input" name="stock1" type="text" placeholder="Enter First Stock Symbol" required>
      <input id="stock2-input" name="stock2" type="text" placeholder="Enter Second Stock Symbol" required>
      <button id="compare-btn" type="submit">Compare</button>
    </form>
  </div>
  <div id="stock-table" class="hidden mx-auto p-4">
    <div class="lv tz asb avu cgf det">
      <table class="tz acj aco">
        <thead>
          <tr>
            <th scope="col" class="asg att aui avq awg awm ayb chl">Metric</th>
            <th scope="col" class="arl asg avq awg awm ayb" id="stock1-title">Stock 1</th>
            <th scope="col" class="arl asg avq awg awm ayb" id="stock2-title">Stock 2</th>
          </tr>
        </thead>
        <tbody id="stock-data" class="acj acn">
          <tr>
            <td class="adt asi att aui awg awk ayb chl">Current Price</td>
            <td class="adt arl asi awg axx" id="stock1-price">-</td>
            <td class="adt arl asi awg axx" id="stock2-price">-</td>
          </tr>
          <tr>
            <td class="adt asi att aui awg awk ayb chl">Market Cap</td>
            <td class="adt arl asi awg axx" id="stock1-market-cap">-</td>
            <td class="adt arl asi awg axx" id="stock2-market-cap">-</td>
          </tr>
          <tr>
            <td class="adt asi att aui awg awk ayb chl">Dividend Yield</td>
            <td class="adt arl asi awg axx" id="stock1-dividend-yield">-</td>
            <td class="adt arl asi awg axx" id="stock2-dividend-yield">-</td>
          </tr>
          <tr>
            <td class="adt asi att aui awg awk ayb chl">5 Year Dividend Growth</td>
            <td class="adt arl asi awg axx" id="stock1-dividend-growth">-</td>
            <td class="adt arl asi awg axx" id="stock2-dividend-growth">-</td>
          </tr>
          <tr>
            <td class="adt asi att aui awg awk ayb chl">P/E Ratio</td>
            <td class="adt arl asi awg axx" id="stock1-pe-ratio">-</td>
            <td class="adt arl asi awg axx" id="stock2-pe-ratio">-</td>
          </tr>
          <tr>
            <td class="adt asi att aui awg awk ayb chl">Industry Average P/E</td>
            <td class="adt arl asi awg axx" id="stock1-industry-pe">-</td>
            <td class="adt arl asi awg axx" id="stock2-industry-pe">-</td>
          </tr>
          <tr>
            <td class="adt asi att aui awg awk ayb chl">Revenue</td>
            <td class="adt arl asi awg axx" id="stock1-revenue">-</td>
            <td class="adt arl asi awg axx" id="stock2-revenue">-</td>
          </tr>
          <tr>
            <td class="adt asi att aui awg awk ayb chl">Net Income</td>
            <td class="adt arl asi awg axx" id="stock1-net-income">-</td>
            <td class="adt arl asi awg axx" id="stock2-net-income">-</td>
          </tr>
          <tr>
            <td class="adt asi att aui awg awk ayb chl">Total Assets</td>
            <td class="adt arl asi awg axx" id="stock1-total-assets">-</td>
            <td class="adt arl asi awg axx" id="stock2-total-assets">-</td>
          </tr>
          <tr>
            <td class="adt asi att aui awg awk ayb chl">Long Term Debt</td>
            <td class="adt arl asi awg axx" id="stock1-long-term-debt">-</td>
            <td class="adt arl asi awg axx" id="stock2-long-term-debt">-</td>
          </tr>
          <tr>
            <td class="adt asi att aui awg awk ayb chl">Cash & Investments</td>
            <td class="adt arl asi awg axx" id="stock1-cash-investments">-</td>
            <td class="adt arl asi awg axx" id="stock2-cash-investments">-</td>
          </tr>
          <tr>
            <td class="adt asi att aui awg awk ayb chl">Free Cash Flow</td>
            <td class="adt arl asi awg axx" id="stock1-free-cash-flow">-</td>
            <td class="adt arl asi awg axx" id="stock2-free-cash-flow">-</td>
          </tr>
          <tr>
            <td class="adt asi att aui awg awk ayb chl">1 Year Price Target</td>
            <td class="adt arl asi awg axx" id="stock1-price-target">-</td>
            <td class="adt arl asi awg axx" id="stock2-price-target">-</td>
          </tr>
          <tr>
            <td class="adt asi att aui awg awk ayb chl">Historical Data</td>
            <td class="adt arl asi awg axx">
              <div class="chart-container" style="width: 100%;">
                <canvas id="stock1-chart" class="hidden"></canvas>
                <div class="skeleton-loader"></div> <!-- Placeholder skeleton image -->
              </div>
              <div class="mt-2 text-center">
                <a href="#" class="text-purple-500" onclick="changeRange('stock1', 'day')">Day</a> |
                <a href="#" class="text-purple-500" onclick="changeRange('stock1', 'week')">Week</a> |
                <a href="#" class="text-purple-500" onclick="changeRange('stock1', 'month')">Month</a>
              </div>
            </td>
            <td class="adt arl asi awg axx">
              <div class="chart-container" style="width: 100%;">
                <canvas id="stock2-chart" class="hidden"></canvas>
                <div class="skeleton-loader"></div> <!-- Placeholder skeleton image -->
              </div>
              <div class="mt-2 text-center">
                <a href="#" class="text-purple-500" onclick="changeRange('stock2', 'day')">Day</a> |
                <a href="#" class="text-purple-500" onclick="changeRange('stock2', 'week')">Week</a> |
                <a href="#" class="text-purple-500" onclick="changeRange('stock2', 'month')">Month</a>
              </div>
            </td>
          </tr>
          <tr>
            <td class="adt asi att aui awg awk ayb chl">Pros</td>
            <td class="adt arl asi awg axx" id="stock1-pros">-</td>
            <td class="adt arl asi awg axx" id="stock2-pros">-</td>
          </tr>
          <tr>
            <td class="adt asi att aui awg awk ayb chl">Cons</td>
            <td class="adt arl asi awg axx" id="stock1-cons">-</td>
            <td class="adt arl asi awg axx" id="stock2-cons">-</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
`;

// Import the environment variable
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

async function fetchStockData(symbol) {
  try {
    const response = await fetch(`${backendUrl}/stock/${symbol}`);
    if (!response.ok) {
      throw new Error(`Error fetching data for ${symbol}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`Fetched data for ${symbol}:`, data);
    return data;
  } catch (error) {
    console.error(`Fetch error for ${symbol}:`, error);
    return null;
  }
}

async function fetchHistoricalData(symbol, range) {
  let interval;
  if (range === 'day') {
    interval = 'day';
  } else if (range === 'week') {
    interval = 'week';
  } else if (range === 'month') {
    interval = 'month';
  } else {
    throw new Error('Invalid range provided');
  }

  try {
    const response = await fetch(`${backendUrl}/stock/${symbol}/historical?range=${interval}`);
    if (!response.ok) {
      throw new Error(`Error fetching historical data for ${symbol}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`Fetched historical data for ${symbol} (${range}):`, data);
    return data;
  } catch (error) {
    console.error(`Fetch historical error for ${symbol}:`, error);
    return null;
  }
}

async function fetchProsCons(symbol) {
  try {
    const response = await fetch(`${backendUrl}/stock/${symbol}/pros_cons`);
    if (!response.ok) {
      throw new Error(`Error fetching pros and cons for ${symbol}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`Fetched pros and cons for ${symbol}:`, data);
    return data;
  } catch (error) {
    console.error(`Fetch pros and cons error for ${symbol}:`, error);
    return null;
  }
}

async function displayStockData(event) {
  event.preventDefault();

  const stock1Symbol = document.getElementById('stock1-input').value.toUpperCase();
  const stock2Symbol = document.getElementById('stock2-input').value.toUpperCase();

  const stock1Data = await fetchStockData(stock1Symbol);
  const stock2Data = await fetchStockData(stock2Symbol);

  const stock1ProsCons = await fetchProsCons(stock1Symbol);
  const stock2ProsCons = await fetchProsCons(stock2Symbol);

  console.log('Stock 1 Data:', stock1Data);
  console.log('Stock 2 Data:', stock2Data);

  const table = document.getElementById('stock-table');

  if (!stock1Data || !stock2Data || !stock1ProsCons || !stock2ProsCons) {
    table.classList.add('hidden');
    showAlert('Oops! Something went wrong');
    return;
  }

  table.classList.remove('hidden');

  const metrics = [
    { id: 'price', label: 'Current Price', field: 'quote.c' },
    { id: 'market-cap', label: 'Market Cap', field: 'fundamentals.metric.marketCapitalization' },
    { id: 'dividend-yield', label: 'Dividend Yield', field: 'fundamentals.metric.dividendYieldIndicatedAnnual' },
    { id: 'dividend-growth', label: '5 Year Dividend Growth', field: 'fundamentals.metric.dividendGrowthRate5Y' },
    { id: 'pe-ratio', label: 'P/E Ratio', field: 'fundamentals.metric.peInclExtraTTM' },
    { id: 'industry-pe', label: 'Industry Average P/E', field: 'fundamentals.metric.industryPE' },
    { id: 'revenue', label: 'Revenue', field: 'fundamentals.metric.totalRevenue' },
    { id: 'net-income', label: 'Net Income', field: 'fundamentals.metric.netIncome' },
    { id: 'total-assets', label: 'Total Assets', field: 'fundamentals.metric.totalAssets' },
    { id: 'long-term-debt', label: 'Long Term Debt', field: 'fundamentals.metric.totalDebt' },
    { id: 'cash-investments', label: 'Cash & Investments', field: 'fundamentals.metric.cashAndShortTermInvestments' },
    { id: 'free-cash-flow', label: 'Free Cash Flow', field: 'fundamentals.metric.freeCashFlowTTM' },
    { id: 'price-target', label: '1 Year Price Target', field: 'fundamentals.metric.targetPrice' }
  ];

  metrics.forEach(metric => {
    if (document.getElementById(`stock1-${metric.id}`)) {
      document.getElementById(`stock1-${metric.id}`).innerText = getField(stock1Data, metric.field) || '-';
    }
    if (document.getElementById(`stock2-${metric.id}`)) {
      document.getElementById(`stock2-${metric.id}`).innerText = getField(stock2Data, metric.field) || '-';
    }
  });

  if (stock1ProsCons && stock1ProsCons.pros) {
    document.getElementById('stock1-pros').innerHTML = formatProsCons(stock1ProsCons.pros, 'pros');
  } else {
    document.getElementById('stock1-pros').innerText = '-';
  }

  if (stock1ProsCons && stock1ProsCons.cons) {
    document.getElementById('stock1-cons').innerHTML = formatProsCons(stock1ProsCons.cons, 'cons');
  } else {
    document.getElementById('stock1-cons').innerText = '-';
  }

  if (stock2ProsCons && stock2ProsCons.pros) {
    document.getElementById('stock2-pros').innerHTML = formatProsCons(stock2ProsCons.pros, 'pros');
  } else {
    document.getElementById('stock2-pros').innerText = '-';
  }

  if (stock2ProsCons && stock2ProsCons.cons) {
    document.getElementById('stock2-cons').innerHTML = formatProsCons(stock2ProsCons.cons, 'cons');
  } else {
    document.getElementById('stock2-cons').innerText = '-';
  }

  function getField(data, field) {
    return field.split('.').reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : null, data);
  }

  if (stock1Data && stock1Data.profile) {
    document.getElementById('stock1-title').innerText = `${stock1Data.profile.name || stock1Symbol} (${stock1Symbol})`;
  } else {
    console.error(`Missing data for ${stock1Symbol}`);
    document.getElementById('stock1-title').innerText = 'Failed to load data';
  }

  if (stock2Data && stock2Data.profile) {
    document.getElementById('stock2-title').innerText = `${stock2Data.profile.name || stock2Symbol} (${stock2Symbol})`;
  } else {
    console.error(`Missing data for ${stock2Symbol}`);
    document.getElementById('stock2-title').innerText = 'Failed to load data';
  }

  await displayStockChart(stock1Symbol, 'stock1-chart', 'week');
  await displayStockChart(stock2Symbol, 'stock2-chart', 'week');
}

function formatProsCons(items, type) {
  const icon = type === 'pros' 
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
        <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
      </svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
        <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l-1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clip-rule="evenodd" />
      </svg>`;
  
  return items.map(item => `
    <div class="flex items-center space-x-4">
      <div>${icon}</div>
      <div>
        <p class="font-medium">${item.title}</p>
        <p>${item.content}</p>
      </div>
    </div>
  `).join('');
}

async function displayStockChart(symbol, canvasId, range) {
  const canvas = document.getElementById(canvasId);
  const skeletonLoader = canvas.nextElementSibling;

  canvas.classList.add('hidden');
  skeletonLoader.classList.remove('hidden');

  const historicalData = await fetchHistoricalData(symbol, range);

  if (!historicalData || 
      (range === 'day' && !historicalData['Time Series (5min)']) || 
      (range === 'week' && !historicalData['Time Series (60min)']) || 
      (range === 'month' && !historicalData['Time Series (Daily)'])) {
    console.error(`No historical data available for ${symbol} (${range})`);
    canvas.classList.add('hidden');
    skeletonLoader.classList.remove('hidden');
    return;
  }

  let timeSeries;
  if (range === 'day') {
    timeSeries = historicalData['Time Series (5min)'];
  } else if (range === 'week') {
    timeSeries = historicalData['Time Series (60min)'];
  } else if (range === 'month') {
    timeSeries = historicalData['Time Series (Daily)'];
  }

  const labels = Object.keys(timeSeries).reverse();
  const data = labels.map(date => parseFloat(timeSeries[date]['4. close']));

  const ctx = canvas.getContext('2d');

  if (window[canvasId] instanceof Chart) {
    window[canvasId].destroy();
  }

  const chartData = {
    labels,
    datasets: [{
      label: `${symbol} Price`,
      data,
      borderColor: '#6B46C1', // Purple color for the line
      borderWidth: 2,
      fill: false,
      tension: 0.4 // Smoothing the line
    }]
  };

  window[canvasId] = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 2000, // Progressive easing
        easing: 'easeInOutQuad'
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: range === 'day' ? 'minute' : 'day'
          },
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Price'
          }
        }
      }
    }
  });

  canvas.classList.remove('hidden');
  skeletonLoader.classList.add('hidden');
}

async function changeRange(stock, range) {
  const titleText = document.getElementById(`${stock}-title`).innerText;
  const symbol = titleText.split('(').pop().split(')')[0]; // Extract the symbol from the title
  await displayStockChart(symbol, `${stock}-chart`, range);
}

window.changeRange = changeRange; // Attach changeRange to the global window object

document.getElementById('stock-form').addEventListener('submit', displayStockData);

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const themeIcon = document.getElementById('toggle-icon');
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
        <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clip-rule="evenodd"/>
      </svg>
    `;
  } else {
    document.body.classList.remove('dark-mode');
    themeIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
        <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z"></path>
      </svg>
    `;
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  localStorage.setItem('theme', newTheme);
}

document.getElementById('toggle-theme').addEventListener('click', toggleTheme);

// Apply the saved theme on initial load
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

async function checkServerHealth() {
  try {
    const response = await fetch('${backendUrl}/healthz');
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    return true;
  } catch (error) {
    console.error('Health check error:', error);
    return false;
  }
}

function showAlert(message) {
  const alertContainer = document.createElement('div');
  alertContainer.innerHTML = `
    <div class="afq ahl amb aqz"><div class="lx"><div class="uw"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="of si bar"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg></div><div class="jw"><p class="awg bat">${message}</p></div></div></div>
  `;
  app.appendChild(alertContainer);
}

document.addEventListener('DOMContentLoaded', async () => {
  const isServerHealthy = await checkServerHealth();
  if (!isServerHealthy) {
    app.innerHTML = '<h1 class="text-center">Oops! Something went wrong</h1>';
  }
});
