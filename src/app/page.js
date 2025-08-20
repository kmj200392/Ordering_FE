'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

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
            src="/images/Logo.svg"
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
  return (
    <div className={styles.menuContainer}>
      {/* 배경 이미지 */}
      <div className={styles.backgroundWrapper}>
        <Image
          src="/images/Background.svg"
          alt="Background"
          fill
          className={styles.backgroundImage}
        />
      </div>

      {/* 배경 그라디언트 오버레이 */}
      <div className={styles.backgroundGradient}></div>

      {/* 헤더 */}
      <header className={styles.header}>
        <div className={styles.headerLogo}>
          <Image
            src="/images/Logo.svg"
            alt="Header Logo"
            width={65}
            height={60}
            className={styles.headerLogoImage}
          />
        </div>
        <span className={styles.headerText}>주문내역</span>
      </header>

      {/* 메인 메뉴 타이틀 */}
      <div className={styles.menuTitle}>
        <div className={styles.menuTitleImage}></div>
        <p className={styles.menuTitleText}>⚠️ 안주는 선불결제입니다!</p>
      </div>

      {/* 메뉴 리스트 */}
      <div className={styles.menuList}>
        <MenuItem
          name="테토야끼"
          price="17,000"
        />
        <MenuItem
          name="에겐남의 마음처럼&#10;따뜻한 콘치즈"
          price="18,000"
        />
        <MenuItem
          name="테토남의 소울푸드&#10;제육볶음"
          price="18,000"
        />
        <MenuItem
          name="테토녀가 직접 사냥한&#10;치킨 가라아게"
          price="18,000"
        />
        <MenuItem
          name="두부상 에겐남이 만든&#10;순두부찌개"
          price="16,000"
        />
        <MenuItem
          name="에겐, 테토 다같이&#10;김치~전"
          price="16,000"
          isLast={true}
        />
      </div>

      {/* 음료 메뉴 타이틀 */}
      <div className={styles.drinksTitle}>
        <div className={styles.drinksTitleImage}></div>
        <p className={styles.drinksTitleText}>⚠️ 주류 및 음료는 후불결제입니다!</p>
      </div>
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
