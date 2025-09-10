'use client';
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import styles from '../../page.module.css';
import MenuList from '../../components/MenuList';

function LandingPage() {
    return (
        <div className={styles.landingContainer}>
            <div className={styles.backgroundWrapper}>
                <Image src="/images/Background.svg" alt="Background" fill className={styles.backgroundImage} priority />
            </div>
            <div className={styles.backgroundGradient}></div>
            <div className={styles.backgroundElements}>
                <div className={styles.logoBackground} aria-hidden="true">
                    <img src="/images/Logo2.png" alt="" width="409" height="392" className={styles.logoElements} loading="eager" />
                </div>
            </div>
            <div className={styles.logoSection}>
                <div className={styles.kuLogoContainer}>
                    <Image src="/images/KU@300x-8.svg" alt="KU Logo" width={157} height={64} className={styles.kuLogo} />
                </div>
                <div className={styles.nameLogoContainer}>
                    <img src="/images/Name@300x-8.svg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
            </div>
            <div className={styles.dateSection}>
                <Image src="/images/date-yellow@300x-8 1.svg" alt="Date" width={195} height={70} className={styles.dateYellow} />
            </div>
        </div>
    );
}

export default function OrderPage() {
    const params = useParams();
    const rawTableId = params?.tableId;
    const tableId = Array.isArray(rawTableId) ? rawTableId[0] : (rawTableId || '');

    const [showLanding, setShowLanding] = useState(true);
    useEffect(() => {
        const t = setTimeout(() => setShowLanding(false), 2000);
        return () => clearTimeout(t);
    }, []);

    const items = [
        { id: 'm1', name: '테토야끼', price: 17000, imageSrc: '/images/menu/menu-01.png' },
        { id: 'm2', name: '에겐남의 마음처럼<br />따뜻한 콘치즈', price: 18000, imageSrc: '/images/menu/menu-02.png' },
        { id: 'm3', name: '테토남의 소울푸드<br />제육볶음', price: 18000, imageSrc: '/images/menu/menu-03.png' },
        { id: 'm4', name: '테토녀가 직접 사냥한<br />치킨 가라아게', price: 18000, imageSrc: '/images/menu/menu-04.png' },
        { id: 'm5', name: '두부상 에겐남이 만든<br />순두부찌개', price: 16000, imageSrc: '/images/menu/menu-05.png' },
        { id: 'm6', name: '에겐, 테토 다같이<br />김치~전', price: 16000, imageSrc: '/images/menu/menu-06.png' }
    ];

    const drinkItems = [
        { id: 'd1', name: '소주', price: 5000, imageSrc: '/images/menu/menu-07.png' },
        { id: 'd2', name: '맥주', price: 5000, imageSrc: '/images/menu/menu-08-45ede9.png' },
        { id: 'd3', name: '과일소주', price: 6000, imageSrc: '/images/menu/menu-09.png' },
        { id: 'd4', name: '매화수', price: 7000, imageSrc: '/images/menu/menu-10.png' },
        { id: 'd5', name: '음료', price: 2000, imageSrc: '/images/menu/menu-11.png' }
    ];

    const allItems = [...items, ...drinkItems];
    const priceMap = allItems.reduce((acc, it) => { acc[it.id] = it.price; return acc; }, {});

    const [openKey, setOpenKey] = useState(null);
    const [receiptOpen, setReceiptOpen] = useState(false);
    const [receiptLines, setReceiptLines] = useState([]);
    const [receiptTitle, setReceiptTitle] = useState('주문 완료!');

    const [quantities, setQuantities] = useState(() => {
        const init = Object.create(null);
        allItems.forEach(i => { init[i.id] = 0; });
        return init;
    });

    const increment = (id) => setQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    const decrement = (id) => setQuantities(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) - 1) }));
    const removeLine = (id) => setQuantities(prev => ({ ...prev, [id]: 0 }));

    const { totalQty, totalAmount, selectedItems } = (() => {
        let qty = 0; let amount = 0; const selected = [];
        allItems.forEach(it => {
            const q = quantities[it.id] || 0;
            if (q > 0) { qty += q; amount += q * (priceMap[it.id] || 0); selected.push({ id: it.id, name: it.name, quantity: q }); }
        });
        return { totalQty: qty, totalAmount: amount, selectedItems: selected };
    })();

    const receiptTotals = useMemo(() => {
        let qty = 0; let amount = 0;
        (receiptLines || []).forEach(l => {
            const q = Number(l.quantity || 0);
            qty += q;
            amount += q * (priceMap[l.id] || 0);
        });
        return { qty, amount };
    }, [receiptLines, priceMap]);

    const handleOpenReceipt = (snapshot, title) => {
        setReceiptLines(snapshot || []);
        setReceiptTitle(title || '주문 완료!');
        setReceiptOpen(true);
        setOpenKey(null);
    };

    const handlePaid = async (snapshot) => {
        try {
            const num = Number(tableId) || 0;
            const payload = {
                tableNum: num,
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
                setOpenKey(null);
                setReceiptOpen(false);
                setReceiptLines([]);
            }
            return res.ok;
        } catch (e) { /* ignore */ }
    };

    function stripHtml(html) {
        if (!html) return '';
        if (typeof window === 'undefined') return html.replace(/<[^>]*>/g, '');
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return (tmp.textContent || tmp.innerText || '').trim();
    }

    const normalizeName = (s) => (stripHtml(String(s || ''))).replace(/\s+/g, '');

    const nameToIdMap = useMemo(() => {
        const map = Object.create(null);
        allItems.forEach(it => {
            map[normalizeName(it.name)] = it.id;
        });
        return map;
    }, [allItems]);

    const openOrderHistory = async () => {
        try {
            const num = Number(tableId) || 0;
            const url = `https://ilhop.kucisc.kr/get_orders_by_table?tableNum=${encodeURIComponent(num)}&includeServed=true`;
            const res = await fetch(url, { method: 'GET', headers: { 'accept': 'application/json' } });
            if (!res.ok) throw new Error(String(res.status));
            const data = await res.json();
            const lines = (data?.orders || []).map((o, idx) => {
                const key = nameToIdMap[normalizeName(o.menuName)] || '';
                return {
                    id: key,
                    name: stripHtml(o.menuName),
                    quantity: Number(o.totalOrders || 0)
                };
            }).filter(l => l.quantity > 0);
            handleOpenReceipt(lines, '주문 내역');
        } catch (e) {
            console.warn('failed to load order history', e);
            handleOpenReceipt([], '주문 내역');
        }
    };

    if (showLanding) {
        return <LandingPage />;
    }

    return (
        <div className={`${styles.menuContainer} ${styles.noScroll}`}>
            <div className={styles.backgroundWrapper}>
                <Image src="/images/Background.svg" alt="Background" fill className={styles.backgroundImage} priority />
            </div>
            <div className={styles.menuBackground}></div>

            {!openKey && !receiptOpen && (
                <div className={styles.menuHeader}>
                    <div className={styles.headerLogo}>
                        <img src="/images/Logo.svg" alt="Header Logo" style={{ width: '65px', height: '60px', objectFit: 'cover' }} />
                    </div>
                    <div className={styles.headerTitle} onClick={openOrderHistory} role="button">주문내역</div>
                </div>
            )}

            {!openKey && !receiptOpen && (
                <div className={styles.menuTitleSection}>
                    <div className={styles.menuTitleImage}>
                        <img src="/images/titles/menu-title.png" alt="메인메뉴" style={{ width: '149px', height: '29px', objectFit: 'contain' }} />
                    </div>
                </div>
            )}

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

            {receiptOpen && (
                <div className={styles.receiptScreen} role="dialog" aria-modal="true">
                    <div className={styles.cartScreenHeader}>
                        <button type="button" className={styles.cartBackBtn} onClick={() => setReceiptOpen(false)} aria-label="뒤로">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <polyline points="15 4 7 12 15 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    <div className={styles.receiptTitleGreen}>{receiptTitle}</div>
                    <div className={styles.receiptPanelOuter}>
                        <div className={styles.receiptPanelInner}>
                            <div className={styles.receiptTotal}>{`총 ${receiptTotals.qty}개 | ${receiptTotals.amount.toLocaleString('ko-KR')}원`}</div>
                            <div className={styles.receiptDivider}></div>
                            <div className={styles.receiptSubTitle}>{`최근 주문 내역 (${receiptLines.length}개)`}</div>
                            <div className={styles.receiptList}>
                                {receiptLines.map(line => (
                                    <div className={styles.receiptRow} key={`receipt-${line.id || line.name}`}>
                                        <div className={styles.receiptRowName} dangerouslySetInnerHTML={{ __html: `${line.name} x${line.quantity}` }} />
                                        <div className={styles.receiptRowAmount}>{(line.quantity * (priceMap[line.id] || 0)).toLocaleString('ko-KR')}원</div>
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