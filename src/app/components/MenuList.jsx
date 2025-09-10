'use client';

import { useMemo, useState } from 'react';
import styles from '../page.module.css';

function formatPrice(value) {
    try {
        return Number(value || 0).toLocaleString('ko-KR');
    } catch {
        return String(value);
    }
}

export default function MenuList({
    items,
    containerClassName,
    imageObjectFit = 'cover',
    selfKey,
    openKey,
    onOpenCart,
    onCloseCart,
    quantities,
    onIncrement,
    onDecrement,
    onRemove,
    allSelectedItems,
    totalQty,
    totalAmount,
    itemPriceMap,
    showCartBar = false,
    isReceiptOpen = false,
    onOpenReceipt,
    onPaid,
}) {
    const hasAnyOpen = Boolean(openKey);
    const cartOpen = openKey && selfKey && openKey === selfKey;

    return (
        <>
            {!hasAnyOpen && !isReceiptOpen && (
                <div className={containerClassName || styles.menuItems}>
                    {(items || []).map(item => {
                        const q = (quantities && quantities[item.id]) || 0;
                        const rightTotal = q > 0 ? q * item.price : item.price;
                        return (
                            <div className={styles.menuItem} key={item.id}>
                                <div className={styles.menuItemLeft}>
                                    <img
                                        src={item.imageSrc}
                                        alt={item.name}
                                        style={{ width: '65px', height: '65px', objectFit: imageObjectFit, borderRadius: '5px' }}
                                    />
                                    <div className={styles.menuItemInfo}>
                                        <div className={styles.menuItemName} dangerouslySetInnerHTML={{ __html: item.name }} />
                                        <div className={styles.menuItemPrice}>{formatPrice(item.price)}</div>
                                    </div>
                                </div>
                                <div className={styles.menuItemRight}>
                                    <div className={styles.quantityControl}>
                                        <button className={styles.minusButton} type="button" onClick={() => onDecrement && onDecrement(item.id)} disabled={q === 0}>
                                            <div className={styles.minusCircle}></div>
                                            <div className={styles.minusIcon}>-</div>
                                        </button>
                                        <div className={styles.quantity}>{String(q).padStart(2, '0')}</div>
                                        <button className={styles.plusButton} type="button" onClick={() => onIncrement && onIncrement(item.id)}>
                                            <div className={styles.plusCircle}></div>
                                            <div className={styles.plusIcon}>+</div>
                                        </button>
                                    </div>
                                    <div className={styles.totalPrice}>{formatPrice(rightTotal)}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showCartBar && totalQty > 0 && !hasAnyOpen && !isReceiptOpen && (
                <div className={styles.cartBar} onClick={() => onOpenCart && onOpenCart(selfKey)}>
                    <div className={styles.cartCountPill}><span>{totalQty}</span></div>
                    <div className={styles.cartLabel}>{`${formatPrice(totalAmount)}원 담기`}</div>
                </div>
            )}

            {cartOpen && !isReceiptOpen && (allSelectedItems || []).length > 0 && (
                <div className={styles.cartScreen}>
                    <div className={styles.cartScreenHeader}>
                        <button type="button" className={styles.cartBackBtn} onClick={() => onCloseCart && onCloseCart()} aria-label="뒤로">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <polyline points="15 4 7 12 15 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <div className={styles.cartHeaderRight}>주문내역</div>
                    </div>

                    <div className={styles.cartScreenTitle}>장바구니</div>

                    <div className={styles.cartPanel}>
                        {allSelectedItems.map(line => (
                            <div className={styles.cartRow} key={`figma-row-${line.id}`}>
                                <div className={styles.cartRowLeft}>
                                    <div className={styles.cartRowName} dangerouslySetInnerHTML={{ __html: line.name }} />
                                    <div className={styles.cartRowPrice}>{formatPrice(itemPriceMap?.[line.id] ?? line.price ?? 0)}</div>
                                </div>
                                <div className={styles.cartRowRight}>
                                    <button type="button" className={styles.cartRemoveBtn} onClick={() => onRemove && onRemove(line.id)}>×</button>
                                    <div className={styles.cartRowControls}>
                                        <button className={styles.optionBtn} type="button" onClick={() => { /* 옵션변경 자리 */ }}>{'옵션 변경'}</button>
                                        <div className={styles.quantityControl}>
                                            <button className={styles.minusButton} type="button" onClick={() => onDecrement && onDecrement(line.id)} disabled={line.quantity === 0}>
                                                <div className={styles.minusCircle}></div>
                                                <div className={styles.minusIcon}>-</div>
                                            </button>
                                            <div className={styles.quantity}>{String(line.quantity).padStart(2, '0')}</div>
                                            <button className={styles.plusButton} type="button" onClick={() => onIncrement && onIncrement(line.id)}>
                                                <div className={styles.plusCircle}></div>
                                                <div className={styles.plusIcon}>+</div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button type="button" className={styles.cartPanelAddMore} onClick={() => onCloseCart && onCloseCart()}>메뉴 더 추가 +</button>
                    </div>

                    <ConfirmOrderUI
                        totalQty={totalQty}
                        totalAmount={totalAmount}
                        selectedItems={allSelectedItems}
                        itemPriceMap={itemPriceMap}
                        onOpenReceipt={onOpenReceipt}
                        onPaid={onPaid}
                    />
                </div>
            )}
        </>
    );
}

function ConfirmOrderUI({ totalQty, totalAmount, selectedItems = [], itemPriceMap = {}, onOpenReceipt, onPaid }) {
    const [payOpen, setPayOpen] = useState(false);
    const bankName = 'KEB 하나은행';
    const accountHolder = '김예진';
    const accountNo = '51191082320107';
    const handleCopy = async () => {
        try { await navigator.clipboard.writeText(accountNo); } catch { }
    };

    const openReceipt = async () => {
        const snapshot = (selectedItems || []).map(line => ({
            id: line.id,
            name: line.name,
            quantity: line.quantity,
            unitPrice: itemPriceMap?.[line.id] ?? 0,
            amount: (itemPriceMap?.[line.id] ?? 0) * (line.quantity || 0),
        }));
        let shouldOpen = true;
        try {
            if (onPaid) {
                const result = await onPaid(snapshot);
                if (result === false) {
                    shouldOpen = false;
                }
            }
        } catch { }
        if (shouldOpen) {
            onOpenReceipt && onOpenReceipt(snapshot);
        }
        setPayOpen(false);
    };

    return (
        <>
            <div className={styles.cartCtaBar} onClick={() => setPayOpen(true)} role="button">
                <div className={styles.cartCountPill}><span>{totalQty}</span></div>
                <div className={styles.cartCtaLabel}>{`${formatPrice(totalAmount)}원 주문하기`}</div>
            </div>

            {payOpen && (
                <div className={styles.modalOverlay} onClick={() => setPayOpen(false)}>
                    <div className={styles.payModalCard} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
                        <div className={styles.payInner}>
                            <div className={styles.payTitle}>계좌이체</div>
                            <div className={styles.payAmount}>{formatPrice(totalAmount)}원</div>
                            <div className={styles.bankSection}>
                                <div className={styles.bankHeader} aria-hidden="true">
                                    <div className={styles.payBankLogo}>
                                        <img src="/images/bank-hana-165bcf.png" alt="KEB 하나은행" width={46} height={42} style={{ objectFit: 'contain' }} />
                                    </div>
                                    <div className={styles.payBankName}>KEB 하나은행</div>
                                </div>
                                <div className={styles.payHolder}>{accountHolder}</div>
                                <div className={styles.payAccountRow}>
                                    <div className={styles.payAccount}>{accountNo}</div>
                                    <button type="button" className={styles.copyBtn} onClick={handleCopy} aria-label="계좌번호 복사">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <rect x="9" y="9" width="11" height="11" rx="2" stroke="#2C2C2C" strokeWidth="2" />
                                            <rect x="4" y="4" width="11" height="11" rx="2" stroke="#2C2C2C" strokeWidth="2" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button type="button" className={styles.payPrimaryBtn} onClick={openReceipt}>이체 완료</button>
                    </div>
                </div>
            )}
        </>
    );
} 