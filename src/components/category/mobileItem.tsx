import * as React from 'react'
import {FunctionComponent} from 'react'
import {Category} from "../../interfaces";
import {pipe} from "fp-ts/es6/pipeable";
import {tail} from "fp-ts/es6/Array";
import {getOrElse} from "fp-ts/es6/Option";
import './mobileItemStyles.scss'


export interface Props {
    data: Category,
    path: Category[],
    onClick: (params: {
        path: Category[],
        isOpen: boolean,
        isLast: boolean,
    }) => void,

}

export const MobileItem: FunctionComponent<Props> = (props) => {
    const isLast = props.data.listInnerCat.length === 0;
    const isOpen = props.data.id === props.path[0]?.id;
    const isEmpty = props.path.length === 0;
    return (<div className={'item_mobile'}>
            {
                (isOpen || isEmpty) &&
                <a
                    className={`field  ${isOpen ? 'open' : ''}`}
                    onClick={() => props.onClick({
                        path: [props.data],
                        isOpen,
                        isLast,
                    })}
                >{props.data.txt}</a>
            }
            <ul className={'second_ul_mobile'}>
                {
                    isOpen && props.data.listInnerCat.map(data => <MobileItem
                        key={data.id}
                        data={data}
                        path={pipe(tail(props.path), getOrElse<Category[]>(() => []))}
                        onClick={params => props.onClick({
                            ...params,
                            path: [props.data, ...params.path]
                        })}
                    />)
                }
            </ul>
        </div>
    )
}
