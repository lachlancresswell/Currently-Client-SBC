export const ArrowRight = ({ onClick }: { onClick?: React.MouseEventHandler; }) => {
    return <Arrow onClick={onClick} text='▶' dataTestId="ArrowRight" />;
};
export const ArrowLeft = ({ onClick }: { onClick?: React.MouseEventHandler; }) => {
    return <Arrow onClick={onClick} text='◀' dataTestId="ArrowLeft" />;
};
export const ArrowUp = ({ onClick }: { onClick?: React.MouseEventHandler; }) => {
    return <Arrow onClick={onClick} text='⬆' dataTestId="ArrowUp" />;
};
export const ArrowDown = ({ onClick }: { onClick?: React.MouseEventHandler; }) => {
    return <Arrow onClick={onClick} text='⬇' dataTestId="ArrowDown" />;
};
export const Arrow = ({ onClick, text, dataTestId }: {
    onClick?: React.MouseEventHandler,
    text: string,
    dataTestId?: string,
}) => {
    return <button className='span-one-modal modal-button-arrow' onClick={onClick} data-testid={dataTestId}>{text}</button>;
};
