import React from 'react';
import ReactDOM from 'react-dom';
import { format, getDay } from 'date-fns';
import { parseBusinessHours, DAYS } from './oh';
import { Feature } from 'mapbox-promoted-js';

let observer: MutationObserver;

const renderCustomElem = (feature: Feature) => {
  const summaryElem = document.querySelector<HTMLElement>('.promotion-side-card__summary');
  const infoElem = document.querySelector<HTMLElement>('.promotion-side-card__info');
  const customElem = document.querySelector<HTMLElement>('.promotion-side-card__custom-row');
  let targetElem: HTMLElement;
  let insertElemClass = '';
  // 概要タブ、情報タブ以外の場合にはスキップ
  if (!summaryElem && !infoElem) { return; }
  if (summaryElem && !customElem) {
    // 概要タブの場合
    targetElem = summaryElem;
    insertElemClass = 'promotion-side-card__summary__row promotion-side-card__custom-row';
  } else if (infoElem && !customElem) {
    // 情報タブの場合
    targetElem = infoElem;
    insertElemClass = 'promotion-side-card__info__row promotion-side-card__custom-row';
  } else {
    // 更新がない場合、Profile内のコンテンツが更新されたときに発生する
    return;
  }
  const insertElem = document.createElement('li');
  insertElem.className = insertElemClass;
  targetElem.prepend(insertElem);
  ReactDOM.render(
    <CustomSummary feature={feature} />,
    document.querySelector('.promotion-side-card__custom-row')
  );
};

const insertCustomElement = (feature: Feature) => {
  const sidecard = document.querySelector<HTMLUListElement>('.promotion-side-card');
  // カードの要素が存在しない場合はスキップ
  if (!sidecard) { return; }
  const customElem = document.querySelector<HTMLElement>('.promotion-side-card__custom-row');
  // カスタム要素が存在する場合には除去する
  if (customElem) { customElem.remove(); }
  // 過去のObserverが存在する場合はクリアしてから利用する
  if (observer) { observer.disconnect(); } 
  renderCustomElem(feature);
  observer = new MutationObserver((_mutations) =>
    renderCustomElem(feature));
  observer.observe(sidecard, {
    characterData: true,
    subtree: true,
    childList: true,
    attributes: true,
  });
};

const CustomSummary: React.FC<{ feature: Feature }> = (props) => {
  const { feature } = props;
  const {
    summary,
    address_ja,
    address_remark,
    phone_number,
    business_hours,
    business_hours_remark,
  } = feature.properties;
  let businessHourInterval = {};
  let businessHoursLabel = '詳細はお問い合わせください。';
  if (business_hours) {
    const businessHourIntervals = parseBusinessHours(business_hours);
    const day = DAYS[getDay(new Date())];
    businessHourInterval = businessHourIntervals[day] || {};
  }
  if (businessHourInterval.start && businessHourInterval.end) {
    businessHoursLabel = `${format(businessHourInterval.start, 'HH:mm')}〜${format(businessHourInterval.end, 'HH:mm')}`;
  }
  return (
    <div className='promotion-side-card__custom-row__wrapper'>
      <ul className='promotion-side-card__custom-row__detail'>
        {summary ? (
          <li className='promotion-side-card__custom-row__detail-item'>
            <span className='promotion-side-card__custom-row__detail-item__title'>
              <strong className='promotion-side-card__custom-row__detail-item__title-label'>
                概要：
              </strong>
            </span>
            <div className='promotion-side-card__custom-row__detail-item__value'>
              <span className='promotion-side-card__custom-row__detail-item__value-label'>
                {summary}
              </span>
            </div>        
          </li>
        ) : null}
        <li className='promotion-side-card__custom-row__detail-item'>
          <span className='promotion-side-card__custom-row__detail-item__title'>
            <strong className='promotion-side-card__custom-row__detail-item__title-label'>
              住所：
            </strong>
          </span>
          <div className='promotion-side-card__custom-row__detail-item__value'>
            <span className='promotion-side-card__custom-row__detail-item__value-label'>
              {address_ja}
            </span>
            {address_remark ? (
              <span className='promotion-side-card__custom-row__detail-item__value-remark'>
                {address_remark}
              </span>
            ) : null}
          </div>        
        </li>
        {phone_number ? (
          <li className='promotion-side-card__custom-row__detail-item'>
            <span className='promotion-side-card__custom-row__detail-item__title'>
              <strong className='promotion-side-card__custom-row__detail-item__title-label'>
                電話番号：
              </strong>
            </span>
            <div className='promotion-side-card__custom-row__detail-item__value'>
              <span className='promotion-side-card__custom-row__detail-item__value-label'>
                {phone_number}
              </span>
            </div>        
          </li>
        ) : null}
        <li className='promotion-side-card__custom-row__detail-item'>
          <span className='promotion-side-card__custom-row__detail-item__title'>
            <strong className='promotion-side-card__custom-row__detail-item__title-label'>
              営業時間：
            </strong>
          </span>
          <div className='promotion-side-card__custom-row__detail-item__value'>
            <span className='promotion-side-card__custom-row__detail-item__value-label'>
              {businessHoursLabel}
            </span>
            {business_hours_remark ? (
              <span className='promotion-side-card__custom-row__detail-item__value-remark'>
                {business_hours_remark}
              </span>
            ) : null}            
          </div>
        </li>
      </ul>
    </div>
  );
};

(window as any).insertCustomElement = insertCustomElement;
