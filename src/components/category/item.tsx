import * as React from 'react'
import {FunctionComponent, useMemo, useRef} from "react";
import {Category} from "../../interfaces";
import {pipe} from "fp-ts/es6/pipeable";
import {tail} from "fp-ts/es6/Array";
import {getOrElse} from "fp-ts/es6/Option";
import './itemStyles.scss'



export interface Props {
    data: Category,
    path: Category[],
    onClick: (params: {
        path: Category[],
        isOpen: boolean,
        isLast: boolean,
    }) => void,

}

export const Item: FunctionComponent<Props> = (props) => {
    const isOpen = props.data.id === props.path[0]?.id;
    const isLast = props.data.listInnerCat.length === 0;
    return (
        <div className={'item'} style={{background: isOpen ? '#189691' : 'white'}}>
            <a
                className={'field'}
                style={{color: isOpen ? 'white' : 'black'}}
                onClick={() => props.onClick({
                    path: [props.data],
                    isOpen,
                    isLast,
                })}
            >
                {props.data.txt}
            </a>
            {
                (isOpen && !isLast) && <ul className={'second_ul'} style={{top: '-2px', display: (isOpen) ? 'block' : 'none'}}>
                    {
                        props.data.listInnerCat.map(data =>
                            <Item

                                key={data.id}
                                data={data}
                                path={pipe(tail(props.path), getOrElse<Category[]>(() => []))}
                                onClick={params => props.onClick({
                                    ...params,
                                    path: [props.data, ...params.path]
                                })}
                            />
                        )
                    }
                </ul>
            }
        </div>


    )
};