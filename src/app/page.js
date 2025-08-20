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
          priority
        />
      </div>

      {/* 배경 그라디언트 오버레이 */}
      <div className={styles.menuBackground}></div>

      {/* 헤더 */}
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

      {/* 메인메뉴 타이틀 */}
      <div className={styles.menuTitleSection}>
        <div className={styles.menuTitleImage}>
          <img
            src="/images/메인메뉴@300x-8.png"
            alt="메인메뉴"
            style={{
              width: '180px',
              height: '95px',
              objectFit: 'cover'
            }}
          />
        </div>
        <div className={styles.menuWarning}>⚠️  안주는 선불결제입니다!</div>
      </div>

      {/* 메뉴 아이템들 */}
      <div className={styles.menuItems}>
        {/* 테토야끼 */}
        <div className={styles.menuItem}>
          <div className={styles.menuItemLeft}>
            <div className={styles.menuItemImage}></div>
            <div className={styles.menuItemInfo}>
              <div className={styles.menuItemName}>테토야끼</div>
              <div className={styles.menuItemPrice}>17,000</div>
            </div>
          </div>
          <div className={styles.menuItemRight}>
            <div className={styles.quantityControl}>
              <div className={styles.minusButton}>
                <div className={styles.minusCircle}></div>
                <div className={styles.minusIcon}>-</div>
              </div>
              <div className={styles.quantity}>00</div>
              <div className={styles.plusButton}>
                <div className={styles.plusCircle}></div>
                <div className={styles.plusIcon}>+</div>
              </div>
            </div>
            <div className={styles.totalPrice}>17,000</div>
          </div>
        </div>

        {/* 에겐남의 마음처럼 따뜻한 콘치즈 */}
        <div className={styles.menuItem}>
          <div className={styles.menuItemLeft}>
            <div className={styles.menuItemImage}></div>
            <div className={styles.menuItemInfo}>
              <div className={styles.menuItemName}>에겐남의 마음처럼<br />따뜻한 콘치즈</div>
              <div className={styles.menuItemPrice}>18,000</div>
            </div>
          </div>
          <div className={styles.menuItemRight}>
            <div className={styles.quantityControl}>
              <div className={styles.minusButton}>
                <div className={styles.minusCircle}></div>
                <div className={styles.minusIcon}>-</div>
              </div>
              <div className={styles.quantity}>00</div>
              <div className={styles.plusButton}>
                <div className={styles.plusCircle}></div>
                <div className={styles.plusIcon}>+</div>
              </div>
            </div>
            <div className={styles.totalPrice}>18,000</div>
          </div>
        </div>

        {/* 테토남의 소울푸드 제육볶음 */}
        <div className={styles.menuItem}>
          <div className={styles.menuItemLeft}>
            <div className={styles.menuItemImage}></div>
            <div className={styles.menuItemInfo}>
              <div className={styles.menuItemName}>테토남의 소울푸드<br />제육볶음</div>
              <div className={styles.menuItemPrice}>18,000</div>
            </div>
          </div>
          <div className={styles.menuItemRight}>
            <div className={styles.quantityControl}>
              <div className={styles.minusButton}>
                <div className={styles.minusCircle}></div>
                <div className={styles.minusIcon}>-</div>
              </div>
              <div className={styles.quantity}>00</div>
              <div className={styles.plusButton}>
                <div className={styles.plusCircle}></div>
                <div className={styles.plusIcon}>+</div>
              </div>
            </div>
            <div className={styles.totalPrice}>17,000</div>
          </div>
        </div>

        {/* 테토녀가 직접 사냥한 치킨 가라아게 */}
        <div className={styles.menuItem}>
          <div className={styles.menuItemLeft}>
            <div className={styles.menuItemImage}></div>
            <div className={styles.menuItemInfo}>
              <div className={styles.menuItemName}>테토녀가 직접 사냥한<br />치킨 가라아게</div>
              <div className={styles.menuItemPrice}>18,000</div>
            </div>
          </div>
          <div className={styles.menuItemRight}>
            <div className={styles.quantityControl}>
              <div className={styles.minusButton}>
                <div className={styles.minusCircle}></div>
                <div className={styles.minusIcon}>-</div>
              </div>
              <div className={styles.quantity}>00</div>
              <div className={styles.plusButton}>
                <div className={styles.plusCircle}></div>
                <div className={styles.plusIcon}>+</div>
              </div>
            </div>
            <div className={styles.totalPrice}>17,000</div>
          </div>
        </div>

        {/* 두부상 에겐남이 만든 순두부찌개 */}
        <div className={styles.menuItem}>
          <div className={styles.menuItemLeft}>
            <div className={styles.menuItemImage}></div>
            <div className={styles.menuItemInfo}>
              <div className={styles.menuItemName}>두부상 에겐남이 만든<br />순두부찌개</div>
              <div className={styles.menuItemPrice}>16,000</div>
            </div>
          </div>
          <div className={styles.menuItemRight}>
            <div className={styles.quantityControl}>
              <div className={styles.minusButton}>
                <div className={styles.minusCircle}></div>
                <div className={styles.minusIcon}>-</div>
              </div>
              <div className={styles.quantity}>00</div>
              <div className={styles.plusButton}>
                <div className={styles.plusCircle}></div>
                <div className={styles.plusIcon}>+</div>
              </div>
            </div>
            <div className={styles.totalPrice}>17,000</div>
          </div>
        </div>

        {/* 에겐, 테토 다같이 김치~전 */}
        <div className={`${styles.menuItem} ${styles.lastMenuItem}`}>
          <div className={styles.menuItemLeft}>
            <div className={styles.menuItemImage}></div>
            <div className={styles.menuItemInfo}>
              <div className={styles.menuItemName}>에겐, 테토 다같이<br />김치~전</div>
              <div className={styles.menuItemPrice}>16,000</div>
            </div>
          </div>
          <div className={styles.menuItemRight}>
            <div className={styles.quantityControl}>
              <div className={styles.minusButton}>
                <div className={styles.minusCircle}></div>
                <div className={styles.minusIcon}>-</div>
              </div>
              <div className={styles.quantity}>00</div>
              <div className={styles.plusButton}>
                <div className={styles.plusCircle}></div>
                <div className={styles.plusIcon}>+</div>
              </div>
            </div>
            <div className={styles.totalPrice}>17,000</div>
          </div>
        </div>
      </div>

      {/* 음료 타이틀 */}
      <div className={styles.drinksTitleSection}>
        <div className={styles.drinksTitleImage}>
          <img
            src="/images/음료@300x-8.png"
            alt="음료"
            style={{
              width: '180px',
              height: '95px',
              objectFit: 'cover'
            }}
          />
        </div>
        <div className={styles.drinksWarning}>⚠️  주류 및 음료는 후불결제입니다!</div>
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
