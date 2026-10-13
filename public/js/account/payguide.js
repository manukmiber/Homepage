// The buying guide (/account/how-to-buy): paying by QRIS in rupiah (this
// site's own section, not in Zeiko Chat's guide), and how to finish paying in crypto,
// where to buy it in each part of the world, and what to do when something
// goes wrong. Zeiko Chat's guide, word for word except what differs here (the
// button names, both products sold on this site). Fixed text: nothing in it
// comes from the account door or the visitor. Exchanges are named, never
// linked: a mistyped exchange link is a phishing page.

export const PAY_GUIDE = `<p>ZeikoAI and Zeiko Chat take payment two ways: <strong>QRIS in rupiah</strong>, from any Indonesian bank or e-wallet app (see <a href="#paying-by-qris">Paying by QRIS</a>), or <strong>crypto</strong>, through NOWPayments. You need a little crypto in an exchange account or a wallet, then you send it to the invoice that <strong>Buy for 30 days</strong> (or <strong>Add balance</strong>) opens on <strong>Plans &amp; balance</strong>. This guide covers where to buy it in your part of the world, whether you will have to show ID, how hard signing up is, which coin and network to use, and how to send it so it arrives in full. It ends with step-by-step walkthroughs for the most-used platforms.</p>
<p><strong>Fees and taxes are paid by you, the buyer.</strong> Network (gas) fees, exchange trading and withdrawal fees, card or bank fees, the exchange's spread and any tax in your country are all on your side. The amount on the invoice has to <em>arrive</em> in full: a payment that arrives short is "paid only in part" and does not switch your plan or balance on by itself.</p>
<p>ZeikoAI does not sell crypto, and none of the places below are our partners. If you would rather not touch crypto at all, see <strong>Prefer a bank transfer or another fiat method?</strong> below. Which exchange is allowed, which coins it may sell you and what it asks of you depend on where you live, and they change often: check the platform's own app or site before you sign up. Menu names in the walkthroughs can differ a little between app versions. This is not financial advice.</p>
<nav class="docs-toc" aria-label="In this guide">
<p>In this guide</p>
<ul>
<li><a href="#paying-by-qris">Paying by QRIS</a></li>
<li><a href="#the-short-version">The short version</a></li>
<li><a href="#which-coin-to-pay-with">Which coin to pay with</a></li>
<li><a href="#fees-and-taxes">Fees and taxes</a></li>
<li><a href="#kyc-will-i-have-to-show-id">KYC: will I have to show ID?</a></li>
<li><a href="#how-hard-is-signing-up">How hard is signing up</a></li>
<li><a href="#three-kinds-of-places-to-buy">Three kinds of places to buy</a></li>
<li><a href="#anywhere-in-the-world">Anywhere in the world</a></li>
<li><a href="#asia">Asia</a></li>
<li><a href="#europe-and-the-uk">Europe and the UK</a></li>
<li><a href="#north-and-latin-america">North and Latin America</a></li>
<li><a href="#africa">Africa</a></li>
<li><a href="#step-by-step-on-popular-platforms">Step by step on popular platforms</a></li>
<li><a href="#paying-from-elsewhere-in-the-universe">Paying from elsewhere in the universe</a></li>
<li><a href="#prefer-a-bank-transfer-or-another-fiat-method">Prefer a bank transfer or another fiat method?</a></li>
<li><a href="#subscriptions">Subscriptions</a></li>
<li><a href="#when-something-goes-wrong">When something goes wrong</a></li>
</ul>
</nav>
<h2 id="paying-by-qris">Paying by QRIS</h2>
<p>QRIS is Indonesia's one QR code for paying: every Indonesian bank app and e-wallet scans it (GoPay, OVO, DANA, ShopeePay, LinkAja, BCA, Mandiri, BRI, BNI and the rest). From Malaysia, Singapore and Thailand, an app that pays QRIS abroad can scan it too; check that your app offers it before you start.</p>
<ol>
<li>On <strong>Plans &amp; balance</strong>, press <strong>Or pay by QRIS</strong> on a plan, or pick <strong>QRIS (rupiah)</strong> under <strong>Balance</strong> and choose an amount.</li>
<li>A QR opens with the price in rupiah, at today's rate. The last digits are that payment's own code.</li>
<li>Scan it in your app. The amount fills in by itself: check it is <strong>exactly</strong> the amount on the page, then pay.</li>
<li>Back on the page, press <strong>I've paid</strong>.</li>
<li>We check every QRIS payment by hand, usually within 10 minutes. Your plan or balance then switches on by itself, and the page says so.</li>
</ol>
<p>A code stays open for an hour; past that, start a new one. Send one payment per code, of the exact amount: a different amount cannot be matched to you. If something went wrong — you paid but the page says the code closed, or that the payment was not found — write to <strong><a href="mailto:payment@zeiko.biz.id">payment@zeiko.biz.id</a></strong> with your username, the amount, the time and your app's receipt.</p>
<p>The rest of this guide is about paying in crypto.</p>
<h2 id="the-short-version">The short version</h2>
<ol>
<li>On <strong>Plans &amp; balance</strong>, press <strong>Buy for 30 days</strong> on a plan (<strong>Add 30 days</strong> on the one you have), or pick an amount under <strong>Balance</strong> and press <strong>Add balance</strong>.</li>
<li>The NOWPayments invoice opens. Pick the coin <em>and</em> the network you are going to send.</li>
<li>The page shows an amount, an address (and a memo or tag for some coins) and a timer.</li>
<li>In your exchange or wallet, choose <strong>Withdraw</strong> or <strong>Send</strong>: the same coin, the same network, paste the address, and send enough that the shown amount arrives after the exchange's withdrawal fee.</li>
<li>Wait. Once the network confirms it (usually minutes) your plan or balance switches on by itself, and your account says so when you come back.</li>
</ol>
<p><strong>First time?</strong> Sign up and get verified <em>before</em> you press <strong>Buy</strong> or <strong>Add balance</strong>. Verification can take from minutes to a few days, and the invoice's timer does not wait for it.</p>
<h2 id="which-coin-to-pay-with">Which coin to pay with</h2>
<p>The invoice takes far more than USDT. Pay with whatever you already hold or can buy cheaply where you live: it is converted for us automatically.</p>
<ul>
<li><strong>Stablecoins (worth about $1 each, the easiest):</strong> USDT on BNB Smart Chain (BEP20), Tron (TRC20), Polygon, Solana, TON, Arbitrum, Optimism, Avalanche, Celo, opBNB and Ethereum; USDC on Base, Polygon, Solana, Arbitrum, Optimism, Algorand, Avalanche, BNB Smart Chain and Ethereum; also PayPal USD (PYUSD), FDUSD, DAI, TUSD and USD1.</li>
<li><strong>Popular coins:</strong> BTC, ETH, BNB, SOL, TRX, TON, LTC, XRP, DOGE, ADA, XLM, DOT, AVAX, POL (MATIC) and hundreds more. The invoice's list is the full one.</li>
</ul>
<p>The cheapest to send are usually stablecoins on <strong>BNB Smart Chain (BEP20)</strong>, <strong>Tron (TRC20)</strong>, <strong>Polygon</strong>, <strong>Solana</strong> or <strong>TON</strong>: a few cents of gas or less. USDT or USDC on <strong>Ethereum (ERC20)</strong> can cost several dollars in gas, and BTC can be slow and dear when the network is busy, so avoid them for small amounts.</p>
<p><strong>The network must match.</strong> USDT on BNB Smart Chain and USDT on Tron are the same coin on different roads: send on a network other than the one the invoice shows and the money is lost. If the invoice shows a <strong>memo</strong> or <strong>tag</strong> (XRP, XLM, some TON and EOS payments), you must fill it in.</p>
<h2 id="fees-and-taxes">Fees and taxes</h2>
<p>Everything between your money and the invoice is yours to pay:</p>
<ul>
<li><strong>The exchange's trading fee and spread</strong> when you buy the coin.</li>
<li><strong>The withdrawal fee.</strong> Many exchanges take it <em>out of</em> the amount you type. If the invoice says 10.00 USDT and the fee is 0.80, withdraw 10.80.</li>
<li><strong>Network gas.</strong> Included in the withdrawal fee on an exchange; paid on top from a self-custody wallet (in BNB, TRX, SOL, ETH… so keep a little).</li>
<li><strong>Card, bank or e-wallet fees</strong> for putting money into the exchange.</li>
<li><strong>Taxes.</strong> Some countries tax every crypto trade or transfer (for example, Indonesian exchanges add the crypto transaction tax to each trade, and India withholds 1% TDS on crypto transfers). Gains may also be taxable. Paying them, and reporting them where the law asks, is up to you.</li>
</ul>
<h2 id="kyc-will-i-have-to-show-id">KYC: will I have to show ID?</h2>
<p><strong>Almost certainly, yes.</strong> KYC ("know your customer") is the identity check a licensed crypto business must run before it lets you put money in or take crypto out. Every exchange, P2P market and card on-ramp in this guide asks for it before you can buy with your own money. It is the law where they operate, not a choice they make.</p>
<p>What it usually takes:</p>
<ul>
<li><strong>A government ID</strong>: national ID card (KTP, MyKad, PhilSys, Aadhaar…), passport or driving licence. The name must match the bank account or card you pay with, or deposits bounce.</li>
<li><strong>A selfie or a short face video</strong>, taken live in the app ("liveness"). Good light, no glasses or hat, the whole ID in frame and readable.</li>
<li><strong>Basic details</strong>: address, date of birth, job and where your money comes from. Some places also ask for a tax number (PAN in India, SSN in the US, SIN in Canada) or proof of address (a bank statement or utility bill under three months old).</li>
<li><strong>Sometimes a short quiz</strong> about crypto risks (common in the EU and UK).</li>
</ul>
<p>How long: from <strong>a few minutes</strong> (automatic checks in most apps) to <strong>one or two working days</strong> when a person has to look, and longer in busy weeks. A blurry photo or a name that does not match is the commonest reason for a rejection: retake it rather than waiting.</p>
<p><strong>Levels.</strong> Many exchanges verify in steps: a first level for small amounts, a higher one (proof of address, more questions) for larger limits. The first level is plenty for a plan or a balance here.</p>
<p><strong>What about "no-KYC"?</strong> Some exchanges let an account that already <em>holds</em> crypto trade and withdraw small amounts without ID (MEXC, for example, caps unverified withdrawals at around 1,000 USDT a day in most countries). That does not help you <em>buy</em> with money: putting rupiah, pesos, euros or dollars in still needs ID everywhere. Be wary of anyone selling crypto "without KYC" outside an exchange's own P2P escrow: it is the commonest scam there is, and you have no way back if it goes wrong. Never buy a "verified account" from someone: it can be frozen with your money in it.</p>
<h2 id="how-hard-is-signing-up">How hard is signing up</h2>
<p>Every platform in the tables below has a <strong>Sign-up</strong> grade:</p>
<ul>
<li><strong>Easy</strong>: an app, an ID and a selfie; usually ready the same day.</li>
<li><strong>Medium</strong>: something extra, such as proof of address, a tax number, a linked bank account, a risk quiz, or a review that can take a few days.</li>
<li><strong>Hard</strong>: in practice only for residents, with a local bank account or phone number in your own name (Japan and South Korea, for example).</li>
</ul>
<p>If a place in your country is Hard for you, use a global exchange's P2P market or an instant on-ramp instead. P2P is the usual way in when local exchanges will not take your bank: the walkthrough is <strong>Binance P2P</strong> below.</p>
<h2 id="three-kinds-of-places-to-buy">Three kinds of places to buy</h2>
<ul>
<li><strong>Exchanges</strong>: an account with ID checks (KYC). Cheapest once set up. You pay in by bank transfer, e-wallet or card, buy the coin, then withdraw it to the invoice.</li>
<li><strong>P2P markets</strong> inside the big exchanges: you buy from another person, who takes your local bank or e-wallet transfer, while the exchange holds their coins in escrow. Useful where banks will not pay exchanges. You still verify your ID with the exchange. Only trade inside the app, with sellers who have a long history; never pay outside it.</li>
<li><strong>Instant on-ramps</strong>: buy with a card, Apple Pay or Google Pay without an exchange account (they still check ID, the first time). Quick, but usually the dearest. Send to your own wallet first: on-ramps take minutes and the invoice's timer does not wait.</li>
</ul>
<p>Type the platform's address yourself or use its app from the official app store: fake exchange sites and "support agents" in direct messages are the commonest way people lose crypto. Nobody from ZeikoAI or Zeiko Chat will ever ask for your password, seed phrase or a "verification payment".</p>
<h2 id="anywhere-in-the-world">Anywhere in the world</h2>
<div class="doc-table-wrap"><table class="doc-table doc-table-cards">
<thead><tr><th scope="col">Platform</th><th scope="col">Kind</th><th scope="col">KYC</th><th scope="col">Sign-up</th><th scope="col">Notes</th></tr></thead>
<tbody>
<tr><th scope="row">Binance</th><td data-label="Kind">Exchange, P2P</td><td data-label="KYC">ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Most countries, not the US (see Binance.US). Big P2P market in local currencies.</td></tr>
<tr><th scope="row">OKX</th><td data-label="Kind">Exchange, P2P</td><td data-label="KYC">ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Most of Asia, Europe, Latin America and Africa.</td></tr>
<tr><th scope="row">Bybit</th><td data-label="Kind">Exchange, P2P</td><td data-label="KYC">ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Most of Asia, Latin America and Africa; card purchases.</td></tr>
<tr><th scope="row">KuCoin</th><td data-label="Kind">Exchange, P2P</td><td data-label="KYC">ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Wide coverage; card and P2P.</td></tr>
<tr><th scope="row">Bitget</th><td data-label="Kind">Exchange, P2P</td><td data-label="KYC">ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Wide coverage; card and P2P.</td></tr>
<tr><th scope="row">Gate</th><td data-label="Kind">Exchange, P2P</td><td data-label="KYC">ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Very long coin list.</td></tr>
<tr><th scope="row">MEXC</th><td data-label="Kind">Exchange, P2P</td><td data-label="KYC">ID + selfie to buy with money</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Long coin list; card through partners.</td></tr>
<tr><th scope="row">HTX</th><td data-label="Kind">Exchange, P2P</td><td data-label="KYC">ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Asia, Latin America, Africa.</td></tr>
<tr><th scope="row">Crypto.com</th><td data-label="Kind">App, exchange</td><td data-label="KYC">ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Card, bank and Apple/Google Pay in many countries.</td></tr>
<tr><th scope="row">Kraken</th><td data-label="Kind">Exchange</td><td data-label="KYC">ID + selfie + address</td><td data-label="Sign-up">Medium</td><td data-label="Notes">US, Canada, UK, EU, Australia and more.</td></tr>
<tr><th scope="row">Coinbase</th><td data-label="Kind">Exchange</td><td data-label="KYC">ID + selfie (+ SSN in the US)</td><td data-label="Sign-up">Medium</td><td data-label="Notes">US, UK, EU, Canada, Singapore and more.</td></tr>
<tr><th scope="row">Bitfinex</th><td data-label="Kind">Exchange</td><td data-label="KYC">ID + selfie + address</td><td data-label="Sign-up">Medium</td><td data-label="Notes">Not for US residents.</td></tr>
<tr><th scope="row">MoonPay</th><td data-label="Kind">Instant on-ramp</td><td data-label="KYC">ID + selfie on first purchase</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Card, Apple Pay, Google Pay, bank; many countries.</td></tr>
<tr><th scope="row">Transak</th><td data-label="Kind">Instant on-ramp</td><td data-label="KYC">ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Card and local bank methods; built into many wallets.</td></tr>
<tr><th scope="row">Banxa</th><td data-label="Kind">Instant on-ramp</td><td data-label="KYC">ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Card and local bank methods.</td></tr>
<tr><th scope="row">Ramp Network</th><td data-label="Kind">Instant on-ramp</td><td data-label="KYC">ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Card, Apple Pay, bank transfer.</td></tr>
<tr><th scope="row">Mercuryo</th><td data-label="Kind">Instant on-ramp</td><td data-label="KYC">ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Card, Apple Pay, Google Pay.</td></tr>
<tr><th scope="row">Simplex</th><td data-label="Kind">Instant on-ramp</td><td data-label="KYC">ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Card; behind many wallets' Buy button.</td></tr>
<tr><th scope="row">Guardarian</th><td data-label="Kind">Instant on-ramp</td><td data-label="KYC">ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Card and SEPA.</td></tr>
<tr><th scope="row">ChangeNOW</th><td data-label="Kind">Swap, on-ramp</td><td data-label="KYC">Card purchases: ID; swaps: usually none</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Card purchases and coin-to-coin swaps.</td></tr>
<tr><th scope="row">Paybis</th><td data-label="Kind">Instant on-ramp</td><td data-label="KYC">ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Card and bank.</td></tr>
<tr><th scope="row">Alchemy Pay</th><td data-label="Kind">Instant on-ramp</td><td data-label="KYC">ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Card and local methods in Asia and Latin America.</td></tr>
<tr><th scope="row">Onramper</th><td data-label="Kind">On-ramp finder</td><td data-label="KYC">That of the on-ramp it picks</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Compares several on-ramps for your country.</td></tr>
<tr><th scope="row">Trust Wallet</th><td data-label="Kind">Self-custody wallet</td><td data-label="KYC">None for the wallet; its Buy partner checks ID</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Send to the invoice from here.</td></tr>
<tr><th scope="row">MetaMask</th><td data-label="Kind">Self-custody wallet</td><td data-label="KYC">None for the wallet; its Buy partner checks ID</td><td data-label="Sign-up">Easy</td><td data-label="Notes">EVM networks.</td></tr>
<tr><th scope="row">Exodus</th><td data-label="Kind">Self-custody wallet</td><td data-label="KYC">None for the wallet; its Buy partner checks ID</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Many networks.</td></tr>
</tbody>
</table></div>
<h2 id="asia">Asia</h2>
<div class="doc-table-wrap"><table class="doc-table doc-table-cards">
<thead><tr><th scope="col">Platform</th><th scope="col">Where</th><th scope="col">KYC</th><th scope="col">Sign-up</th><th scope="col">Notes</th></tr></thead>
<tbody>
<tr><th scope="row">Indodax</th><td data-label="Where">Indonesia</td><td data-label="KYC">KTP + selfie (passport for foreigners)</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Rupiah by bank transfer and e-wallets; USDT on BEP20, TRC20 and Polygon.</td></tr>
<tr><th scope="row">Tokocrypto</th><td data-label="Where">Indonesia</td><td data-label="KYC">KTP + selfie (passport for foreigners)</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Rupiah deposits; USDT; approved within a day.</td></tr>
<tr><th scope="row">Pintu</th><td data-label="Where">Indonesia</td><td data-label="KYC">KTP + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Simple app; rupiah by bank and e-wallet; USDT on BEP20, Polygon, Solana and more.</td></tr>
<tr><th scope="row">Reku</th><td data-label="Where">Indonesia</td><td data-label="KYC">KTP + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Rupiah by bank transfer; USDT on TRC20.</td></tr>
<tr><th scope="row">Pluang</th><td data-label="Where">Indonesia</td><td data-label="KYC">KTP + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Investment app with crypto.</td></tr>
<tr><th scope="row">Ajaib Kripto</th><td data-label="Where">Indonesia</td><td data-label="KYC">KTP + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">From the Ajaib investment app.</td></tr>
<tr><th scope="row">Triv</th><td data-label="Where">Indonesia</td><td data-label="KYC">KTP + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Rupiah deposits; many networks.</td></tr>
<tr><th scope="row">Nanovest</th><td data-label="Where">Indonesia</td><td data-label="KYC">KTP + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Investment app with crypto.</td></tr>
<tr><th scope="row">Luno</th><td data-label="Where">Malaysia</td><td data-label="KYC">MyKad or passport + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Ringgit by bank transfer.</td></tr>
<tr><th scope="row">MX Global</th><td data-label="Where">Malaysia</td><td data-label="KYC">MyKad + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Ringgit, registered with the Securities Commission.</td></tr>
<tr><th scope="row">Sinegy</th><td data-label="Where">Malaysia</td><td data-label="KYC">MyKad + selfie</td><td data-label="Sign-up">Medium</td><td data-label="Notes">Ringgit, registered with the Securities Commission.</td></tr>
<tr><th scope="row">Hata</th><td data-label="Where">Malaysia</td><td data-label="KYC">MyKad + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Ringgit, registered with the Securities Commission.</td></tr>
<tr><th scope="row">Coinhako</th><td data-label="Where">Singapore</td><td data-label="KYC">Singpass (or ID + address)</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Singapore dollars by bank transfer.</td></tr>
<tr><th scope="row">Independent Reserve</th><td data-label="Where">Singapore</td><td data-label="KYC">ID + selfie + address</td><td data-label="Sign-up">Medium</td><td data-label="Notes">Also Australia and New Zealand.</td></tr>
<tr><th scope="row">Coins.ph</th><td data-label="Where">Philippines</td><td data-label="KYC">PhilSys, passport, UMID or licence + face scan</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Pesos by bank, e-wallet and over the counter; Philippine number needed.</td></tr>
<tr><th scope="row">PDAX</th><td data-label="Where">Philippines</td><td data-label="KYC">Government ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Pesos by bank and e-wallet.</td></tr>
<tr><th scope="row">GCash (GCrypto)</th><td data-label="Where">Philippines</td><td data-label="KYC">A fully verified GCash account</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Inside the GCash app.</td></tr>
<tr><th scope="row">Bitkub</th><td data-label="Where">Thailand</td><td data-label="KYC">Thai ID or passport + selfie + Thai bank account</td><td data-label="Sign-up">Medium</td><td data-label="Notes">Baht by bank transfer.</td></tr>
<tr><th scope="row">Binance TH</th><td data-label="Where">Thailand</td><td data-label="KYC">Thai ID or passport + selfie</td><td data-label="Sign-up">Medium</td><td data-label="Notes">Thailand's licensed Binance.</td></tr>
<tr><th scope="row">Remitano</th><td data-label="Where">Vietnam and others</td><td data-label="KYC">ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">P2P marketplace; also use the P2P markets above.</td></tr>
<tr><th scope="row">CoinDCX</th><td data-label="Where">India</td><td data-label="KYC">PAN + Aadhaar + selfie</td><td data-label="Sign-up">Medium</td><td data-label="Notes">Rupees by UPI and bank.</td></tr>
<tr><th scope="row">Mudrex</th><td data-label="Where">India</td><td data-label="KYC">PAN + Aadhaar + selfie</td><td data-label="Sign-up">Medium</td><td data-label="Notes">Rupees by UPI and bank.</td></tr>
<tr><th scope="row">ZebPay</th><td data-label="Where">India</td><td data-label="KYC">PAN + Aadhaar + selfie</td><td data-label="Sign-up">Medium</td><td data-label="Notes">Rupees by bank.</td></tr>
<tr><th scope="row">CoinSwitch</th><td data-label="Where">India</td><td data-label="KYC">PAN + Aadhaar + selfie</td><td data-label="Sign-up">Medium</td><td data-label="Notes">Rupees by UPI and bank.</td></tr>
<tr><th scope="row">bitFlyer</th><td data-label="Where">Japan</td><td data-label="KYC">My Number card or ID, smartphone eKYC</td><td data-label="Sign-up">Hard</td><td data-label="Notes">Yen. Japanese exchanges do not sell USDT: buy XRP, LTC, BTC or ETH and pay with that.</td></tr>
<tr><th scope="row">Coincheck</th><td data-label="Where">Japan</td><td data-label="KYC">ID, smartphone eKYC</td><td data-label="Sign-up">Hard</td><td data-label="Notes">Yen; BTC, ETH, XRP and more.</td></tr>
<tr><th scope="row">bitbank</th><td data-label="Where">Japan</td><td data-label="KYC">ID, smartphone eKYC</td><td data-label="Sign-up">Hard</td><td data-label="Notes">Yen; BTC, ETH, XRP and more.</td></tr>
<tr><th scope="row">GMO Coin</th><td data-label="Where">Japan</td><td data-label="KYC">ID, smartphone eKYC</td><td data-label="Sign-up">Hard</td><td data-label="Notes">Yen; BTC, ETH, XRP and more.</td></tr>
<tr><th scope="row">SBI VC Trade</th><td data-label="Where">Japan</td><td data-label="KYC">ID, smartphone eKYC</td><td data-label="Sign-up">Hard</td><td data-label="Notes">Yen; the main place in Japan selling USDC.</td></tr>
<tr><th scope="row">Upbit</th><td data-label="Where">South Korea</td><td data-label="KYC">Korean ID, phone and K Bank account in your name</td><td data-label="Sign-up">Hard</td><td data-label="Notes">Won. Withdrawals abroad may need the address registered first.</td></tr>
<tr><th scope="row">Bithumb</th><td data-label="Where">South Korea</td><td data-label="KYC">Korean ID, phone and linked bank account</td><td data-label="Sign-up">Hard</td><td data-label="Notes">Won; same rules on withdrawals.</td></tr>
<tr><th scope="row">Korbit</th><td data-label="Where">South Korea</td><td data-label="KYC">Korean ID, phone and linked bank account</td><td data-label="Sign-up">Hard</td><td data-label="Notes">Won; check which coins it sells.</td></tr>
<tr><th scope="row">MAX (MaiCoin)</th><td data-label="Where">Taiwan</td><td data-label="KYC">Taiwan ID + second ID + bank account</td><td data-label="Sign-up">Medium</td><td data-label="Notes">New Taiwan dollars.</td></tr>
<tr><th scope="row">BitoPro</th><td data-label="Where">Taiwan</td><td data-label="KYC">Taiwan ID + bank account</td><td data-label="Sign-up">Medium</td><td data-label="Notes">New Taiwan dollars.</td></tr>
<tr><th scope="row">HashKey Exchange</th><td data-label="Where">Hong Kong</td><td data-label="KYC">HKID or passport + address + risk quiz</td><td data-label="Sign-up">Medium</td><td data-label="Notes">Licensed; check which coins retail customers may buy.</td></tr>
<tr><th scope="row">OSL</th><td data-label="Where">Hong Kong</td><td data-label="KYC">HKID or passport + address + risk quiz</td><td data-label="Sign-up">Medium</td><td data-label="Notes">Licensed; check which coins retail customers may buy.</td></tr>
<tr><th scope="row">BitOasis</th><td data-label="Where">UAE and Gulf</td><td data-label="KYC">Emirates ID or passport + selfie + address</td><td data-label="Sign-up">Medium</td><td data-label="Notes">Dirhams and other Gulf currencies.</td></tr>
<tr><th scope="row">Rain</th><td data-label="Where">Bahrain and Gulf</td><td data-label="KYC">National ID or passport + selfie + address</td><td data-label="Sign-up">Medium</td><td data-label="Notes">Gulf currencies.</td></tr>
<tr><th scope="row">BtcTurk</th><td data-label="Where">Turkey</td><td data-label="KYC">Turkish ID + selfie</td><td data-label="Sign-up">Medium</td><td data-label="Notes">Lira by bank transfer.</td></tr>
<tr><th scope="row">Paribu</th><td data-label="Where">Turkey</td><td data-label="KYC">Turkish ID + selfie</td><td data-label="Sign-up">Medium</td><td data-label="Notes">Lira by bank transfer.</td></tr>
</tbody>
</table></div>
<p>Pakistan, Bangladesh, Vietnam, Nepal, Sri Lanka and anywhere banks will not pay exchanges: the P2P markets of Binance, OKX and Bybit, with local bank or e-wallet transfers.</p>
<h2 id="europe-and-the-uk">Europe and the UK</h2>
<p><strong>In the EU and EEA, USDT is mostly gone.</strong> Under the EU's MiCA rules most regulated exchanges stopped selling USDT to EEA customers. Buy <strong>USDC</strong> (or BTC, ETH, SOL…) instead and pay with that: the invoice takes it. The UK is outside MiCA; what UK exchanges offer varies. Expect a short risk quiz the first time in both.</p>
<div class="doc-table-wrap"><table class="doc-table doc-table-cards">
<thead><tr><th scope="col">Platform</th><th scope="col">Where</th><th scope="col">KYC</th><th scope="col">Sign-up</th><th scope="col">Notes</th></tr></thead>
<tbody>
<tr><th scope="row">Bitvavo</th><td data-label="Where">EU</td><td data-label="KYC">ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Euros by iDEAL, SEPA, card. USDC and many coins.</td></tr>
<tr><th scope="row">Bitpanda</th><td data-label="Where">EU and UK</td><td data-label="KYC">ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Euros and pounds by SEPA, card, bank.</td></tr>
<tr><th scope="row">Revolut</th><td data-label="Where">EU and UK</td><td data-label="KYC">Already done for the bank account</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Crypto inside the banking app; check that the coin can be withdrawn.</td></tr>
<tr><th scope="row">Kraken</th><td data-label="Where">EU and UK</td><td data-label="KYC">ID + selfie + address</td><td data-label="Sign-up">Medium</td><td data-label="Notes">SEPA, Faster Payments, card.</td></tr>
<tr><th scope="row">Coinbase</th><td data-label="Where">EU and UK</td><td data-label="KYC">ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">SEPA, Faster Payments, card.</td></tr>
<tr><th scope="row">Bitstamp</th><td data-label="Where">EU and UK</td><td data-label="KYC">ID + selfie + address</td><td data-label="Sign-up">Medium</td><td data-label="Notes">SEPA, Faster Payments.</td></tr>
<tr><th scope="row">Crypto.com</th><td data-label="Where">EU and UK</td><td data-label="KYC">ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Card, SEPA, Faster Payments.</td></tr>
</tbody>
</table></div>
<h2 id="north-and-latin-america">North and Latin America</h2>
<p><strong>Canada:</strong> Canadian platforms stopped offering USDT under the Canadian Securities Administrators' rules. Pay with USDC, BTC or ETH.</p>
<div class="doc-table-wrap"><table class="doc-table doc-table-cards">
<thead><tr><th scope="col">Platform</th><th scope="col">Where</th><th scope="col">KYC</th><th scope="col">Sign-up</th><th scope="col">Notes</th></tr></thead>
<tbody>
<tr><th scope="row">Coinbase</th><td data-label="Where">US, Canada</td><td data-label="KYC">ID + selfie + SSN (US)</td><td data-label="Sign-up">Medium</td><td data-label="Notes">Bank, card, PayPal in some states. USDT and USDC (US).</td></tr>
<tr><th scope="row">Kraken</th><td data-label="Where">US, Canada</td><td data-label="KYC">ID + selfie + address + SSN (US)</td><td data-label="Sign-up">Medium</td><td data-label="Notes">Bank and card; some US states are excluded.</td></tr>
<tr><th scope="row">Binance.US</th><td data-label="Where">US</td><td data-label="KYC">ID + selfie + SSN</td><td data-label="Sign-up">Medium</td><td data-label="Notes">Not in every state.</td></tr>
<tr><th scope="row">Gemini</th><td data-label="Where">US, Canada</td><td data-label="KYC">ID + selfie (+ SSN in the US)</td><td data-label="Sign-up">Medium</td><td data-label="Notes">Bank and card; check its coin list.</td></tr>
<tr><th scope="row">Uphold</th><td data-label="Where">US and more</td><td data-label="KYC">ID + selfie + address</td><td data-label="Sign-up">Medium</td><td data-label="Notes">Bank and card; many coins.</td></tr>
<tr><th scope="row">Robinhood</th><td data-label="Where">US</td><td data-label="KYC">SSN + ID</td><td data-label="Sign-up">Medium</td><td data-label="Notes">BTC, ETH, SOL and more can be sent out to a wallet.</td></tr>
<tr><th scope="row">Cash App</th><td data-label="Where">US</td><td data-label="KYC">Name, date of birth, SSN; ID + selfie to send bitcoin</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Bitcoin only: pay the invoice in BTC.</td></tr>
<tr><th scope="row">PayPal and Venmo</th><td data-label="Where">US</td><td data-label="KYC">A verified PayPal or Venmo account</td><td data-label="Sign-up">Easy</td><td data-label="Notes">BTC, ETH and PayPal USD (PYUSD), which the invoice takes.</td></tr>
<tr><th scope="row">Newton</th><td data-label="Where">Canada</td><td data-label="KYC">ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Dollars by Interac e-Transfer.</td></tr>
<tr><th scope="row">Wealthsimple</th><td data-label="Where">Canada</td><td data-label="KYC">ID + SIN</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Inside the investing app.</td></tr>
<tr><th scope="row">Bitbuy</th><td data-label="Where">Canada</td><td data-label="KYC">ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Interac e-Transfer, bank.</td></tr>
<tr><th scope="row">NDAX</th><td data-label="Where">Canada</td><td data-label="KYC">ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Interac e-Transfer, bank.</td></tr>
<tr><th scope="row">Shakepay</th><td data-label="Where">Canada</td><td data-label="KYC">ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">BTC and ETH only.</td></tr>
<tr><th scope="row">Bitso</th><td data-label="Where">Mexico, Argentina, Colombia, Brazil</td><td data-label="KYC">ID + selfie (+ CURP in Mexico)</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Local transfers (SPEI, PIX…).</td></tr>
<tr><th scope="row">Mercado Bitcoin</th><td data-label="Where">Brazil</td><td data-label="KYC">CPF + ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Reais by PIX.</td></tr>
<tr><th scope="row">Lemon</th><td data-label="Where">Argentina</td><td data-label="KYC">DNI + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Pesos; app and card.</td></tr>
<tr><th scope="row">Ripio</th><td data-label="Where">Argentina, Brazil and more</td><td data-label="KYC">ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Local transfers.</td></tr>
<tr><th scope="row">Buenbit</th><td data-label="Where">Argentina</td><td data-label="KYC">DNI + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Local transfers.</td></tr>
</tbody>
</table></div>
<p>The P2P markets of Binance, OKX and Bybit cover most of Latin America too.</p>
<h2 id="africa">Africa</h2>
<div class="doc-table-wrap"><table class="doc-table doc-table-cards">
<thead><tr><th scope="col">Platform</th><th scope="col">Where</th><th scope="col">KYC</th><th scope="col">Sign-up</th><th scope="col">Notes</th></tr></thead>
<tbody>
<tr><th scope="row">VALR</th><td data-label="Where">South Africa</td><td data-label="KYC">ID + selfie + proof of address</td><td data-label="Sign-up">Medium</td><td data-label="Notes">Rand by EFT.</td></tr>
<tr><th scope="row">Luno</th><td data-label="Where">South Africa</td><td data-label="KYC">ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Rand by EFT.</td></tr>
<tr><th scope="row">Quidax</th><td data-label="Where">Nigeria and Africa</td><td data-label="KYC">BVN or NIN + ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Naira and other currencies.</td></tr>
<tr><th scope="row">Busha</th><td data-label="Where">Nigeria</td><td data-label="KYC">BVN + ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Naira by bank transfer.</td></tr>
<tr><th scope="row">Roqqu</th><td data-label="Where">Nigeria and Africa</td><td data-label="KYC">BVN or NIN + ID + selfie</td><td data-label="Sign-up">Easy</td><td data-label="Notes">Naira; app.</td></tr>
</tbody>
</table></div>
<p>Kenya (M-Pesa), Nigeria, Ghana, Uganda, Tanzania and most other countries: the P2P markets of Binance, OKX and Bybit, paid by mobile money or bank.</p>
<h2 id="step-by-step-on-popular-platforms">Step by step on popular platforms</h2>
<p>Every walkthrough ends the same way: you have the coin in your account, and you <strong>withdraw</strong> it to the invoice's address, on the invoice's network, with enough on top for the withdrawal fee. Open the invoice only once you are ready to send: its timer is short.</p>
<p>Before any of them, on any exchange:</p>
<ol>
<li>Install the official app (from the app store, not a link someone sent you).</li>
<li>Sign up with your email or phone number and set a strong password.</li>
<li>Turn on two-factor authentication (an authenticator app is better than SMS).</li>
<li>Finish identity verification (see <a href="#kyc-will-i-have-to-show-id">KYC</a>).</li>
</ol>
<h3 id="indodax-indonesia">Indodax (Indonesia)</h3>
<ol>
<li>Sign up and verify: <strong>Verifikasi Akun</strong>, photograph your KTP, fill in your details, then the face check. Usually minutes, at most a working day.</li>
<li><strong>Deposit Rupiah</strong>: pick a bank virtual account or an e-wallet, transfer the amount shown, and it arrives in a few minutes.</li>
<li><strong>Market → USDT/IDR</strong>, <strong>Beli</strong> (buy) the amount the invoice needs plus the withdrawal fee. A market order fills at once.</li>
<li><strong>Dompet → USDT → Kirim / Tarik</strong>. Choose the network the invoice shows (<strong>BEP20</strong>, <strong>TRC20</strong> or <strong>Polygon</strong>), paste the address and the amount.</li>
<li>Confirm with your 2FA code and the email or phone code. The fee is shown before you confirm, and Indodax sometimes runs free-withdrawal promotions.</li>
</ol>
<h3 id="tokocrypto-indonesia">Tokocrypto (Indonesia)</h3>
<ol>
<li>Sign up, then <strong>Verifikasi Identitas</strong>: KTP (or passport for foreigners), details exactly as on the card, source of income, face check. Approved within a day when everything matches.</li>
<li><strong>Deposit → Rupiah</strong>: bank transfer or virtual account.</li>
<li><strong>Trade → USDT/IDR (or BIDR)</strong>, buy USDT.</li>
<li><strong>Wallet → Withdraw → USDT</strong>, choose <strong>BNB Smart Chain (BEP20)</strong> if the invoice shows it, paste the address, type the amount, confirm.</li>
</ol>
<h3 id="pintu-indonesia">Pintu (Indonesia)</h3>
<ol>
<li>Sign up with your phone number, verify with KTP and a selfie.</li>
<li><strong>Deposit Rupiah</strong> by bank transfer or e-wallet.</li>
<li>Search <strong>USDT</strong>, press <strong>Beli</strong>, type the rupiah amount.</li>
<li>On USDT, press <strong>Kirim</strong> (send), pick the network the invoice shows (BEP20, Polygon or Solana are cheap), paste the address, send.</li>
</ol>
<h3 id="binance-most-countries">Binance (most countries)</h3>
<ol>
<li>Sign up, then <strong>Account → Identification</strong>: country, ID document, a live face check. Most are approved within minutes, some in a few hours.</li>
<li><strong>Buy Crypto</strong>: pay by card (dearer, instant) or by bank transfer or local method where offered. Or use P2P (next walkthrough).</li>
<li><strong>Wallet → Spot → USDT → Withdraw → Send via crypto network</strong>. Paste the address; Binance usually suggests the network; check it matches the invoice (<strong>BSC (BEP20)</strong> or <strong>TRX (TRC20)</strong> are cheap).</li>
<li>Type the amount, read the fee and "receive amount" lines: the <em>receive amount</em> must be the invoice amount. Confirm with your 2FA.</li>
<li>If Binance asks who the recipient is (travel rule), choose a payment to a merchant or another platform and name NOWPayments.</li>
</ol>
<h3 id="binance-p2p-paying-with-a-local-bank-or-e-wallet">Binance P2P (paying with a local bank or e-wallet)</h3>
<ol>
<li>Verify your ID (as above); P2P needs it.</li>
<li><strong>Trade → P2P → Buy → USDT</strong>. Set your currency and payment method (your bank, GoPay, OVO, DANA, GCash, M-Pesa…) and the amount.</li>
<li>Pick a seller with a high completion rate and many orders, and whose limits fit your amount. Press <strong>Buy</strong>.</li>
<li>The order shows the seller's account. Transfer the exact amount from an account <strong>in your own name</strong>, within the time shown (often 15 minutes), with no note about crypto. Then press <strong>Transferred, notify seller</strong>.</li>
<li>The seller releases the USDT into your Funding wallet. If they do not, use <strong>Appeal</strong> inside the order; never settle anything in a chat outside the app.</li>
<li>Move the USDT to Spot if needed, then withdraw as above.</li>
</ol>
<p>OKX P2P and Bybit P2P work the same way: <strong>P2P → Buy</strong>, pick a seller, pay, press "paid", receive, withdraw.</p>
<h3 id="okx">OKX</h3>
<ol>
<li>Sign up, then <strong>Profile → Verification</strong>: ID and a face check.</li>
<li><strong>Buy crypto</strong> with a card or a local method, or use <strong>P2P trading</strong>.</li>
<li><strong>Assets → Withdraw → USDT → On-chain withdrawal</strong>. Choose the network (USDT-BSC, USDT-TRC20, USDT-Polygon, USDT-Solana…), paste the address, type the amount so what arrives is the invoice amount, confirm.</li>
</ol>
<h3 id="bybit">Bybit</h3>
<ol>
<li>Sign up, then <strong>Identity verification</strong>: ID and a face check.</li>
<li><strong>Buy Crypto</strong>: card, a third-party on-ramp, or <strong>P2P Trading</strong>.</li>
<li><strong>Assets → Withdraw → USDT</strong>. Pick the chain the invoice shows, paste the address (Bybit may ask you to add it to the address book the first time), type the amount, confirm with your 2FA.</li>
</ol>
<h3 id="coinsph-philippines">Coins.ph (Philippines)</h3>
<ol>
<li>Sign up with a Philippine mobile number, verify with PhilSys, passport, UMID or a driving licence, then a face scan.</li>
<li><strong>Cash in</strong> pesos by bank, e-wallet or over the counter.</li>
<li><strong>Buy</strong> USDT (or another coin the invoice lists).</li>
<li><strong>Send → Send to external wallet</strong>, choose the network the invoice shows, paste the address, type the amount, confirm.</li>
</ol>
<h3 id="bitflyer-and-other-japanese-exchanges">bitFlyer and other Japanese exchanges</h3>
<p>Japanese exchanges do not sell USDT, so pay in <strong>XRP</strong> or <strong>LTC</strong>: both are cheap and fast to send.</p>
<ol>
<li>Open an account with smartphone identity verification (My Number card or another ID). Accounts are for residents of Japan; approval can take a day or more.</li>
<li>Deposit yen by bank transfer.</li>
<li>Buy XRP (or LTC) on the exchange's trading screen, which is cheaper than the "simple buy" screen.</li>
<li>On the NOWPayments invoice, pick <strong>XRP</strong>: it shows an address <strong>and a destination tag</strong>. Withdraw XRP with both filled in; a missing tag loses the payment.</li>
<li>Japan's travel rule may make the exchange ask about the recipient or refuse a service it cannot check. If it refuses, withdraw to your own wallet first and pay the invoice from there.</li>
</ol>
<h3 id="coinbase-us-uk-eu-canada-and-more">Coinbase (US, UK, EU, Canada and more)</h3>
<ol>
<li>Sign up, verify your ID and phone (US: also your SSN). Link a bank account or debit card.</li>
<li><strong>Buy</strong>: USDC (US: USDT too) or another coin the invoice lists.</li>
<li><strong>Send</strong>: choose the coin and the network the invoice shows (USDC on <strong>Base</strong>, <strong>Polygon</strong> or <strong>Solana</strong> is cheap), paste the address, type the amount, confirm.</li>
</ol>
<h3 id="kraken">Kraken</h3>
<ol>
<li>Sign up and verify to <strong>Intermediate</strong> (ID, selfie, proof of address); the first level does not allow deposits in most countries.</li>
<li>Deposit by bank (SEPA, ACH, Faster Payments…) or buy with a card.</li>
<li>Buy USDC (or USDT where offered).</li>
<li><strong>Withdraw</strong>: choose the coin and the network, add the invoice's address as a new withdrawal address (confirm it by email), type the amount, confirm.</li>
</ol>
<h3 id="bitvavo-eu">Bitvavo (EU)</h3>
<ol>
<li>Sign up, verify with an ID and a selfie, answer the short questionnaire.</li>
<li>Deposit euros by iDEAL, SEPA or card.</li>
<li>Buy USDC.</li>
<li><strong>Withdraw → USDC</strong>, pick the network the invoice shows, paste the address, confirm by email and 2FA.</li>
</ol>
<h3 id="cash-app-us-bitcoin-only">Cash App (US, bitcoin only)</h3>
<ol>
<li>In Cash App, open <strong>Bitcoin</strong> and verify your identity if asked.</li>
<li><strong>Buy</strong> at least the invoice's BTC amount plus a margin.</li>
<li>On the invoice, choose <strong>BTC</strong>. In Cash App press <strong>Send</strong> (the paper plane) on the Bitcoin screen, paste or scan the address, pick a speed: the faster one costs more but beats the invoice's timer.</li>
</ol>
<h3 id="paypal-us">PayPal (US)</h3>
<ol>
<li>Your PayPal account must be verified. Open <strong>Crypto</strong>.</li>
<li>Buy <strong>PayPal USD (PYUSD)</strong>, BTC or ETH.</li>
<li><strong>Send</strong> to an external address: choose the same coin and network the invoice shows (PYUSD on Ethereum or Solana), paste, confirm.</li>
</ol>
<h3 id="moonpay-inside-trust-wallet-no-exchange-account">MoonPay inside Trust Wallet (no exchange account)</h3>
<ol>
<li>Install Trust Wallet, create a wallet and <strong>write the recovery phrase on paper</strong>. Nobody, including us, should ever see it.</li>
<li><strong>Buy → USDT on BNB Smart Chain</strong> (or Tron, or Polygon). Pick MoonPay (or another service it offers), pay by card, Apple Pay or Google Pay.</li>
<li>The first purchase asks for ID and a selfie: minutes, sometimes a day.</li>
<li>Keep a little <strong>BNB</strong> (or TRX, or POL) in the wallet for gas: the on-ramp can sell you that too.</li>
<li>Open the invoice, choose the same coin and network, then in Trust Wallet <strong>Send</strong>, paste the address and the exact amount, confirm.</li>
</ol>
<h2 id="paying-from-elsewhere-in-the-universe">Paying from elsewhere in the universe</h2>
<p>ZeikoAI is served from Earth, and so is NOWPayments. Everything below is true about space and entirely unhelpful about crypto. The rules from the rest of this guide still apply everywhere: the network must match, the memo must be filled in, and fees and taxes are paid by the buyer, in whatever star system the buyer happens to be.</p>
<p>A quick reminder of how this works: light (and so your Wi-Fi) goes about 300,000 km a second. That is fast enough to go round the Earth seven times in a second, and nowhere near fast enough for the rest of this section.</p>
<h3 id="low-earth-orbit-the-iss-and-friends">Low Earth orbit (the ISS and friends)</h3>
<ul>
<li><strong>Signal delay:</strong> a fraction of a second, by way of satellites higher up. The invoice loads fine.</li>
<li>You see about <strong>16 sunrises a day</strong>, which makes "the invoice expires today" an interesting thing to argue about. It expires on Earth's clock.</li>
<li>KYC selfie: take it in the Cupola for the best light in the Solar System. Hold on to your passport; anything you let go of drifts into a filter.</li>
<li>Tax residency: you are still taxed where you were before you left. Orbiting the planet 16 times a day does not make you a resident of every country you fly over, however hard you argue it.</li>
</ul>
<h3 id="the-moon">The Moon</h3>
<ul>
<li><strong>Signal delay:</strong> about <strong>1.3 seconds</strong> each way. The invoice works, just a little laggy, like paying over hotel Wi-Fi.</li>
<li>No exchange has a branch there yet, and there is no P2P market in the Sea of Tranquillity. Buy before you launch.</li>
<li>The KYC selfie needs your helmet off. Please do not do this.</li>
<li>Daylight on the Moon lasts about two Earth weeks, so "same-day verification" means something very different up there.</li>
</ul>
<h3 id="the-sun">The Sun</h3>
<ul>
<li><strong>Signal delay:</strong> about <strong>8 minutes 20 seconds</strong> each way.</li>
<li>Surface around 5,500 °C; the corona, for reasons scientists are still arguing about, over a million. Your phone will not survive either, and neither will your seed phrase written on paper.</li>
<li>We would not recommend paying from here. We would not recommend being here.</li>
</ul>
<h3 id="mercury">Mercury</h3>
<ul>
<li><strong>Signal delay:</strong> roughly <strong>4 to 12 minutes</strong> each way, depending on where it is in its orbit.</li>
<li>A year lasts <strong>88 Earth days</strong>, so a monthly plan is about a third of a Mercurian year. A great deal, from where you stand.</li>
<li>Daytime is hot enough to melt lead, nights fall to about −180 °C. Keep your hardware wallet in the shade, then in a blanket, then in the shade again.</li>
</ul>
<h3 id="venus">Venus</h3>
<ul>
<li><strong>Signal delay:</strong> roughly <strong>2 to 14 minutes</strong> each way. Venus comes closer to Earth than any other planet, which makes it the best-connected place to be crushed and boiled.</li>
<li>A day on Venus (<strong>243 Earth days</strong>) is longer than its year (<strong>225</strong>). If your invoice expires "by the end of the day", you have plenty of time; the timer disagrees.</li>
<li>Clouds of sulphuric acid, 465 °C on the ground and about 90 times Earth's air pressure. The only gas fee lower than Venus's atmosphere is BNB Smart Chain's.</li>
</ul>
<h3 id="mars">Mars</h3>
<ul>
<li><strong>Signal delay:</strong> <strong>3 to 22 minutes</strong> each way, depending on where the two planets are. Every click on the invoice is a round trip, so pressing <strong>Send</strong> and seeing "confirmed" can take most of an hour.</li>
<li>About every two years the Sun sits between Earth and Mars ("solar conjunction") and talking is off for around two weeks. Do not start a payment then. Do not start anything then.</li>
<li>A Martian day (a "sol") is <strong>24 hours 39 minutes</strong>. Plans run in Earth days, so yours ends about 39 minutes earlier every sol than a Martian clock says.</li>
<li>Phobos and Deimos are not exchanges, and their names mean "fear" and "dread", which is roughly how withdrawing on the wrong network feels.</li>
<li>Get verified and add balance before you leave, or ask someone on Earth to pay the invoice for you.</li>
</ul>
<h3 id="the-asteroid-belt">The asteroid belt</h3>
<ul>
<li><strong>Signal delay:</strong> roughly <strong>10 to 35 minutes</strong> each way.</li>
<li>Ceres is the biggest thing in it, a dwarf planet about 940 km across, nearly as long as Java.</li>
<li>Contrary to the films, the asteroids are hundreds of thousands of kilometres apart or more: much emptier than the order book of a coin you have never heard of, which is the only kind of crypto you will find mined out here.</li>
</ul>
<h3 id="jupiter">Jupiter</h3>
<ul>
<li><strong>Signal delay:</strong> roughly <strong>33 to 53 minutes</strong> each way. Each confirmation screen is a lunch break.</li>
<li>A gas giant. <strong>Gas fees</strong> have never been more accurate. The Great Red Spot is a storm bigger than Earth that has been going for centuries; your transaction "pending" for a few minutes is not that bad, really.</li>
<li>A day lasts under <strong>10 hours</strong>, the shortest of any planet, so "verified within one working day" is barely a shift.</li>
<li><strong>Io</strong> has hundreds of active volcanoes; <strong>Europa</strong> has an ocean under its ice. Neither has a bank. Neither will receive your rupiah transfer.</li>
</ul>
<h3 id="saturn">Saturn</h3>
<ul>
<li><strong>Signal delay:</strong> about <strong>70 to 90 minutes</strong> each way.</li>
<li>Saturn is less dense than water: it would float, if you found a bathtub big enough. Your payment, on the other hand, sinks without trace if it goes on the wrong network.</li>
<li>The rings are billions of chunks of ice. Every one of them is a cold wallet.</li>
<li><strong>Titan</strong> has lakes of liquid methane and an atmosphere thick enough to fly in by flapping your arms. Its gas fees are paid in actual gas.</li>
</ul>
<h3 id="uranus">Uranus</h3>
<ul>
<li><strong>Signal delay:</strong> about <strong>2.5 to 3 hours</strong> each way. Open the invoice, press Send, go to bed.</li>
<li>Uranus rolls round the Sun on its side, tilted about 98°, so each pole gets about 42 years of daylight and then 42 years of night. Your invoice expires long before the sun comes up.</li>
<li>It smells of rotten eggs (its clouds contain hydrogen sulphide). Yes, we checked. No, it does not affect the exchange rate.</li>
</ul>
<h3 id="neptune">Neptune</h3>
<ul>
<li><strong>Signal delay:</strong> about <strong>4 hours</strong> each way. A payment and its "thank you" email take most of a working day to reach each other.</li>
<li>The fastest winds in the Solar System, around 2,000 km/h, still slower than a P2P seller who has just been paid and has not released yet.</li>
<li>One Neptunian year is <strong>165 Earth years</strong>. It finished its first full orbit since being discovered in 2011. A yearly plan would be generous.</li>
</ul>
<h3 id="pluto-and-the-kuiper-belt">Pluto and the Kuiper belt</h3>
<ul>
<li><strong>Signal delay:</strong> about <strong>4 to 7 hours</strong> each way.</li>
<li>Pluto was a planet when it was found (1930) and a dwarf planet since 2006. It knows exactly how it feels to have your verification level reduced after the fact.</li>
<li>Sunlight there is about a thousand times dimmer than on Earth, which is still enough for a KYC selfie, the cameras assure us.</li>
<li>The Kuiper belt beyond it is full of icy bodies with names like <strong>Arrokoth</strong>, the most distant thing a spacecraft has ever flown past. Arrokoth does not take USDT either.</li>
</ul>
<h3 id="voyager-1-the-edge-of-the-suns-bubble">Voyager 1, the edge of the Sun's bubble</h3>
<ul>
<li><strong>Signal delay:</strong> about <strong>a full day</strong> each way, and growing. Voyager 1 left the Sun's bubble (the heliosphere) in 2012 and talks to Earth at about 160 bits per second, slower than the first dial-up modems.</li>
<li>At that speed the NOWPayments invoice page would take weeks to load. The timer would expire before the first image did.</li>
<li>It is still carrying a golden record of greetings from Earth. None of them is a seed phrase. Please keep it that way.</li>
</ul>
<h3 id="the-oort-cloud">The Oort cloud</h3>
<ul>
<li><strong>Signal delay:</strong> from about <strong>12 days</strong> at its inner edge to more than <strong>a year</strong> at its outer edge, each way.</li>
<li>A vast, cold shell of comets wrapped round the Solar System, so far out the Sun is just a bright star. Nobody has ever seen it directly; we only know it is there because comets keep arriving from it, like payment notifications from a webhook you forgot you set up.</li>
<li>Your monthly plan renews several times while one message crosses.</li>
</ul>
<h3 id="proxima-centauri-the-nearest-star">Proxima Centauri, the nearest star</h3>
<ul>
<li><strong>Signal delay:</strong> about <strong>4.2 years</strong> each way.</li>
<li>It has at least one planet in its habitable zone, Proxima b. Nobody knows whether anyone lives there, and if they do, whether they hold USDT, and on which network.</li>
<li>Press <strong>Send</strong> on your birthday; hear back on your birthday eight years later. The invoice will have expired, been emailed, and been forgotten by everyone except the blockchain.</li>
</ul>
<h3 id="the-centre-of-the-milky-way">The centre of the Milky Way</h3>
<ul>
<li><strong>Signal delay:</strong> about <strong>26,000 years</strong> each way.</li>
<li>Right at the centre sits <strong>Sagittarius A*</strong>, a black hole about four million times the mass of the Sun. Everything that goes in stays in, which makes it the only thing in the galaxy more final than a crypto transaction.</li>
<li>Payments sent to the wrong network are not, as some believe, collected here. They are just lost, which is worse, because at least a black hole is famous.</li>
</ul>
<h3 id="the-andromeda-galaxy">The Andromeda galaxy</h3>
<ul>
<li><strong>Signal delay:</strong> about <strong>2.5 million years</strong> each way.</li>
<li>The light you see from Andromeda tonight left when early humans were learning to make stone tools. Your invoice expires long before your payment's light leaves the Solar System, and so does your ID.</li>
<li>Andromeda and the Milky Way are heading for each other and are likely to collide in several billion years. Gas fees after the merger have not been published.</li>
</ul>
<h3 id="the-local-group-and-laniakea">The Local Group and Laniakea</h3>
<ul>
<li><strong>Signal delay:</strong> millions to hundreds of millions of years.</li>
<li>The Milky Way, Andromeda and some dozens of smaller galaxies make up the <strong>Local Group</strong>, which is itself a speck in <strong>Laniakea</strong> ("immense heaven" in Hawaiian), a supercluster of around a hundred thousand galaxies.</li>
<li>Somewhere in there, statistically, someone has just sent USDT on Ethereum for a two-dollar payment. We wish them strength.</li>
</ul>
<h3 id="the-observable-universe">The observable universe</h3>
<ul>
<li><strong>Signal delay:</strong> up to about <strong>46 billion light-years</strong> away, and some of it is moving away faster than light can ever catch up, because space itself is stretching. That part of the universe will never receive your payment, your thank-you email or this guide.</li>
<li>About <strong>13.8 billion years</strong> old, holding hundreds of billions of galaxies (some estimates say two trillion), most with billions of stars or more.</li>
<li>Out of all of it, the only thing you need to get right is that the coin and the network match the invoice.</li>
</ul>
<h3 id="the-universe">The universe</h3>
<p>Nobody knows how big the whole universe is, whether it has an edge, or what it is expanding <em>into</em>. Physicists have argued about it for a century and are not done. Here is what we can tell you for certain, from anywhere in it:</p>
<ul>
<li><strong>The network must match.</strong> On Earth, on Neptune, at the edge of time.</li>
<li><strong>Fees and taxes are paid by the buyer</strong>, in every galaxy, observable or not.</li>
<li><strong>Crypto payments cannot be reversed</strong>, and the universe has not shown any sign of being able to reverse anything either. Entropy only goes one way.</li>
<li><strong>Nobody from ZeikoAI or Zeiko Chat will ever ask for your seed phrase</strong>, not even from another dimension.</li>
</ul>
<p>We recommend a long plan, paid in advance, and a cup of tea.</p>
<h2 id="prefer-a-bank-transfer-or-another-fiat-method">Prefer a bank transfer or another fiat method?</h2>
<p>Crypto is not the only way: in rupiah, <a href="#paying-by-qris">pay by QRIS</a>. If you would rather pay by bank transfer, an e-wallet or another ordinary (fiat) method, or P2P and exchanges are not an option where you live, email <strong><a href="mailto:payment@zeiko.biz.id">payment@zeiko.biz.id</a></strong> from the address on your account and tell us:</p>
<ul>
<li>your username (the <code>@name</code> on your profile);</li>
<li>the plan or the top-up you want;</li>
<li>your country and the method you would like to pay with.</li>
</ul>
<p>We reply with how to pay. Do not send money to anyone who contacts you first, or to any account that did not come from a reply to your own email: nobody from ZeikoAI or Zeiko Chat will message you asking for payment.</p>
<h2 id="subscriptions">Subscriptions</h2>
<p><strong>Or renew every 30 days by email</strong>, under a plan's button where it is offered, has NOWPayments email you a payment link now and before every renewal. Each link is paid the same way as above, with the same fees. Skip one and the plan simply ends; nothing is taken automatically.</p>
<h2 id="when-something-goes-wrong">When something goes wrong</h2>
<ul>
<li><strong>Verification was rejected.</strong> Retake the photos in good light with the whole document readable, and check that your name matches your bank account. The exchange's own help centre says what it needs.</li>
<li><strong>The timer ran out.</strong> The invoice expires; nothing is owed. Start a new payment from <strong>Plans &amp; balance</strong>. If you had already sent coins, do not send again: email <a href="mailto:payment@zeiko.biz.id">payment@zeiko.biz.id</a> with the transaction id (hash).</li>
<li><strong>It arrived short</strong> (the withdrawal fee came out of it). It shows as "paid only in part". Email <a href="mailto:payment@zeiko.biz.id">payment@zeiko.biz.id</a> with the transaction id; it is settled by hand.</li>
<li><strong>Wrong network or a missing memo.</strong> Contact the exchange you sent from first; we can only help if the coins reached the invoice's address.</li>
<li><strong>Your exchange asks who receives the coins</strong> (the "travel rule"). It is a payment to a merchant through NOWPayments: choose the option for another wallet or a service not on its list, and give NOWPayments as the recipient if asked.</li>
<li><strong>A P2P seller did not release.</strong> Use <strong>Appeal</strong> in the order and send the exchange your transfer receipt. Never cancel an order you have already paid.</li>
<li><strong>It is taking long.</strong> Some networks need many confirmations, and BTC can take an hour when busy. <strong>Payments</strong> on your account's Overview shows each payment's status, with <strong>Finish paying</strong> while one is still open.</li>
</ul>
<p>Crypto payments cannot be reversed and we do not refund in cash. A plan you replace turns into balance for what is left of it.</p>`;
