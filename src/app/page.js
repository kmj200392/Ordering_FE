'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import MenuList from './components/MenuList';

export default function Home() {
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLanding(false);
    }, 2000); // 2초 후 메뉴 페이지로 전환

    return () => clearTimeout(timer);
  }, []);

  if (showLanding) {
    return <LandingPage />;
  }

  return <MenuPage />;
}

function LandingPage() {
  return (
    <div className={styles.landingContainer}>
      {/* 배경 이미지 */}
      <div className={styles.backgroundWrapper}>
        <Image
          src="/images/Background.svg"
          alt="Background"
          fill
          className={styles.backgroundImage}
          priority
        />
      </div>

      {/* 배경 그라디언트 오버레이 */}
      <div className={styles.backgroundGradient}></div>

      {/* 배경 애니메이션 요소들 (Logo.svg에서 추출) */}
      <div className={styles.backgroundElements}>
        <div className={styles.logoBackground}>
          <Image
            src="/images/Logo.svg"
            alt="Logo Elements"
            width={400}
            height={400}
            className={styles.logoElements}
          />
        </div>
      </div>

      {/* 중앙 로고 영역 - Figma 좌표에 맞춰 배치 */}
      <div className={styles.logoSection}>
        {/* KU 로고 - 위치: x: 122, y: 38, 크기: 157x64 */}
        <div className={styles.kuLogoContainer}>
          <Image
            src="/images/KU@300x-8.svg"
            alt="KU Logo"
            width={157}
            height={64}
            className={styles.kuLogo}
          />
        </div>

        {/* 상단 로고 (이음 Logo.svg) */}
        <div className={styles.nameLogoContainer}>
          <img
            src="/images/Name@300x-8.svg"
            alt="Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
      </div>

      {/* 하단 날짜 - 위치: x: 103, y: 785, 크기: 195x70 */}
      <div className={styles.dateSection}>
        <Image
          src="/images/date-yellow@300x-8 1.svg"
          alt="Date"
          width={195}
          height={70}
          className={styles.dateYellow}
        />
      </div>
    </div>
  );
}

function MenuPage() {
  const items = [
    { id: 'm1', name: '테토야끼', price: 17000, imageSrc: '/images/menu/menu-01.png' },
    { id: 'm2', name: '에겐남의 마음처럼<br />따뜻한 콘치즈', price: 18000, imageSrc: '/images/menu/menu-02.png' },
    { id: 'm3', name: '테토남의 소울푸드<br />제육볶음', price: 18000, imageSrc: '/images/menu/menu-03.png' },
    { id: 'm4', name: '테토녀가 직접 사냥한<br />치킨 가라아게', price: 18000, imageSrc: '/images/menu/menu-04.png' },
    { id: 'm5', name: '두부상 에겐남이 만든<br />순두부찌개', price: 16000, imageSrc: '/images/menu/menu-05.png' },
    { id: 'm6', name: '에겐, 테토 다같이<br />김치~전', price: 16000, imageSrc: '/images/menu/menu-06.png' }
  ];

  const [openKey, setOpenKey] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptLines, setReceiptLines] = useState([]);
  const drinkItems = [
    { id: 'd1', name: '소주', price: 5000, imageSrc: '/images/menu/menu-07.png' },
    { id: 'd2', name: '맥주', price: 5000, imageSrc: '/images/menu/menu-08-45ede9.png' },
    { id: 'd3', name: '과일소주', price: 6000, imageSrc: '/images/menu/menu-09.png' },
    { id: 'd4', name: '매화수', price: 7000, imageSrc: '/images/menu/menu-10.png' },
    { id: 'd5', name: '음료', price: 2000, imageSrc: '/images/menu/menu-11.png' }
  ];

  const allItems = [...items, ...drinkItems];
  const priceMap = allItems.reduce((acc, it) => { acc[it.id] = it.price; return acc; }, {});

  const [quantities, setQuantities] = useState(() => {
    const init = Object.create(null);
    allItems.forEach(i => { init[i.id] = 0; });
    return init;
  });

  const increment = (id) => setQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const decrement = (id) => setQuantities(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) - 1) }));
  const removeLine = (id) => setQuantities(prev => ({ ...prev, [id]: 0 }));

  const { totalQty, totalAmount, selectedItems } = (() => {
    let qty = 0;
    let amount = 0;
    const selected = [];
    allItems.forEach(it => {
      const q = quantities[it.id] || 0;
      if (q > 0) {
        qty += q;
        amount += q * (priceMap[it.id] || 0);
        selected.push({ id: it.id, name: it.name, quantity: q });
      }
    });
    return { totalQty: qty, totalAmount: amount, selectedItems: selected };
  })();

  const handleOpenReceipt = (snapshot) => {
    setReceiptLines(snapshot || []);
    setReceiptOpen(true);
    setOpenKey(null);
  };

  const handlePaid = async (snapshot) => {
    try {
      const payload = {
        tableNum: 0,
        orders: (snapshot || []).map(l => ({ menuName: stripHtml(l.name), quantity: l.quantity }))
      };
      console.log('[send_order] payload', payload);
      const res = await fetch('/api/send_order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const text = await res.text();
      console.log('[send_order] status', res.status, 'ok', res.ok, 'body', text);
      if (res.ok) {
        // clear cart
        setQuantities(prev => {
          const cleared = { ...prev };
          Object.keys(cleared).forEach(k => { cleared[k] = 0; });
          return cleared;
        });
        // ensure any open UI returns to menu
        setOpenKey(null);
        setReceiptOpen(false);
        setReceiptLines([]);
      }
      return res.ok;
    } catch (e) { /* swallow */ }
  };

  function stripHtml(html) {
    if (!html) return '';
    if (typeof window === 'undefined') return html.replace(/<[^>]*>/g, '');
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return (tmp.textContent || tmp.innerText || '').trim();
  }

  return (
    <div className={`${styles.menuContainer} ${styles.noScroll}`}>
      {/* 배경 이미지 */}
      <div className={styles.backgroundWrapper}>
        <Image
          src="/images/Background.svg"
          alt="Background"
          fill
          className={styles.backgroundImage}
          priority
        />
      </div>

      {/* 배경 그라디언트 오버레이 */}
      <div className={styles.menuBackground}></div>

      {/* 헤더 */}
      {!openKey && !receiptOpen && (
        <div className={styles.menuHeader}>
          <div className={styles.headerLogo}>
            <img
              src="/images/Logo.svg"
              alt="Header Logo"
              style={{
                width: '65px',
                height: '60px',
                objectFit: 'cover'
              }}
            />
          </div>
          <div className={styles.headerTitle}>주문내역</div>
        </div>
      )}

      {/* 메인메뉴 타이틀 */}
      {!openKey && !receiptOpen && (
        <div className={styles.menuTitleSection}>
          <div className={styles.menuTitleImage}>
            <img
              src="/images/titles/menu-title.png"
              alt="메인메뉴"
              style={{ width: '149px', height: '29px', objectFit: 'contain' }}
            />
          </div>
        </div>
      )}

      {/* 메뉴 리스트 */}
      <MenuList
        items={items}
        selfKey="main"
        openKey={openKey}
        onOpenCart={(key) => setOpenKey(key)}
        onCloseCart={() => setOpenKey(null)}
        quantities={quantities}
        onIncrement={increment}
        onDecrement={decrement}
        onRemove={removeLine}
        allSelectedItems={selectedItems}
        totalQty={totalQty}
        totalAmount={totalAmount}
        itemPriceMap={priceMap}
        showCartBar={true}
        isReceiptOpen={receiptOpen}
        onOpenReceipt={handleOpenReceipt}
        onPaid={handlePaid}
      />

      {/* 음료 타이틀 */}
      {!openKey && !receiptOpen && (
        <div className={styles.drinksTitleSection}>
          <div className={styles.drinksTitleImage}>
            <img
              src="/images/titles/drinks-title.png"
              alt="주류 & 음료"
              style={{ width: '149px', height: '29px', objectFit: 'contain' }}
            />
          </div>
        </div>
      )}

      {/* 주류 & 음료 리스트 */}
      <MenuList
        containerClassName={`${styles.menuItems} ${styles.drinksOffset}`}
        imageObjectFit="contain"
        selfKey="drinks"
        openKey={openKey}
        onOpenCart={(key) => setOpenKey(key)}
        onCloseCart={() => setOpenKey(null)}
        items={drinkItems}
        quantities={quantities}
        onIncrement={increment}
        onDecrement={decrement}
        onRemove={removeLine}
        allSelectedItems={selectedItems}
        totalQty={totalQty}
        totalAmount={totalAmount}
        itemPriceMap={priceMap}
        isReceiptOpen={receiptOpen}
        onOpenReceipt={handleOpenReceipt}
        onPaid={handlePaid}
      />

      {receiptOpen && (
        <div className={styles.receiptScreen} role="dialog" aria-modal="true">
          <div className={styles.cartScreenHeader}>
            <div className={styles.cartHeaderRight}>주문내역</div>
            <button type="button" className={styles.cartFullClose} onClick={() => setReceiptOpen(false)}>닫기</button>
          </div>
          <div className={styles.receiptTitleGreen}>주문 완료!</div>

          <div className={styles.receiptPanelOuter}>
            <div className={styles.receiptPanelInner}>
              <div className={styles.receiptTotal}>{`총 ${totalQty}개 | ${totalAmount.toLocaleString('ko-KR')}원`}</div>
              <div className={styles.receiptDivider}></div>
              <div className={styles.receiptSubTitle}>{`최근 주문 내역 (${receiptLines.length}개)`}</div>
              <div className={styles.receiptList}>
                {receiptLines.map(line => (
                  <div className={styles.receiptRow} key={`receipt-${line.id}`}>
                    <div className={styles.receiptRowName} dangerouslySetInnerHTML={{ __html: `${line.name} x${line.quantity}` }} />
                    <div className={styles.receiptRowAmount}>{(line.quantity * priceMap[line.id]).toLocaleString('ko-KR')}원</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.receiptBtn} onClick={() => setReceiptOpen(false)} role="button">메뉴판으로</div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ name, price, isLast = false }) {
  const [quantity, setQuantity] = useState(0);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(0, prev - 1));

  return (
    <div className={`${styles.menuItem} ${isLast ? styles.menuItemLast : ''}`}>
      <div className={styles.menuItemLeft}>
        <div className={styles.foodImage}></div>
        <div className={styles.menuItemInfo}>
          <h3 className={styles.menuItemName} dangerouslySetInnerHTML={{ __html: name }}></h3>
          <p className={styles.menuItemPrice}>{price}</p>
        </div>
      </div>

      <div className={styles.menuItemRight}>
        <div className={styles.quantityControls}>
          <button
            className={styles.quantityButton}
            onClick={decrementQuantity}
            disabled={quantity === 0}
          >
            <span className={styles.minusIcon}>−</span>
          </button>
          <span className={styles.quantity}>{quantity.toString().padStart(2, '0')}</span>
          <button
            className={styles.quantityButton}
            onClick={incrementQuantity}
          >
            <span className={styles.plusIcon}>+</span>
          </button>
        </div>
        <p className={styles.totalPrice}>{price}</p>
      </div>
    </div>
  );
}
