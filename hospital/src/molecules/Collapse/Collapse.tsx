import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { ReactComponent as Arrow } from 'src/public/CollapseArrow.svg'
import './Collapse.scss'
import { CollapseType } from './CollapseType'

export const Collapse = ({ children, title, className }: CollapseType) => {
  const [isOpen, setIsOpen] = useState(false)
  const [height, setHeight] = useState<number | undefined>()

  const ref = useRef<HTMLDivElement>(null)

  const showCollapseHandler = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if (!height || !isOpen || !ref.current) return undefined
    const resizeObserver = new ResizeObserver((el) => {
      setHeight(el[0].contentRect.height)
    })
    resizeObserver.observe(ref.current)
    return () => {
      resizeObserver.disconnect()
    }
  }, [height, isOpen])

  useEffect(() => {
    if (isOpen) setHeight(ref.current?.getBoundingClientRect().height)
    else setHeight(0)
  }, [isOpen])

  return (
    <div className={classNames('collapse', className)}>
      <div className="collapse__transition">
        {isOpen ? (
          <div className="collapse__icon-button active" onClick={showCollapseHandler}>
            <div>{title}</div>
            <Arrow className="collapse__rotate-arrow down" />
          </div>
        ) : (
          <div className="collapse__icon-button" onClick={showCollapseHandler}>
            <div>{title}</div>
            <Arrow className="collapse__rotate-arrow up" />
          </div>
        )}

        <div className="collapse__content" style={{ height }}>
          <div ref={ref}>
            <div>{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
