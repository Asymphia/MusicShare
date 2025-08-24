interface OverlayProps {
    offset: number
    radius: number
    isTransparent?: boolean
}

const Overlay = ({ offset, radius, isTransparent = true }: OverlayProps) => {
    return (
        <div
            style={{
                width: `calc(100% - ${ 2 * offset }px)`,
                height: `calc(100% - ${ 2 * offset }px)`,
                top: `${offset}px`,
                left: `${offset}px`,
                borderRadius: `${radius}px`
            }}
            className={`absolute ${isTransparent ? "bg-[linear-gradient(127deg,#ffffff4D_0%,#ffffff1A_60%)]" : "bg-[linear-gradient(127deg,#353535_0%,#242424_60%)]"}`}
        />
    )
}

export default Overlay