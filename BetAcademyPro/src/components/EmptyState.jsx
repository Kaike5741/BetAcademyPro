import { FaRegFolderOpen } from 'react-icons/fa'

export default function EmptyState({ title = 'Nada por aqui ainda', description = 'Quando houver dados, eles aparecerão nesta área.' }) {
  return (
    <div className="empty-state">
      <FaRegFolderOpen />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}
