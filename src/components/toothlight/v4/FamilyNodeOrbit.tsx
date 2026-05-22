import styles from './FamilyNodeOrbit.module.css'

type FamilyNodeOrbitProps = {
  nodes?: Array<{
    id: string
    kind: 'family_note' | 'family_gift' | 'family_note_gift'
  }>
}

const noteColor = '#f7a7ba'
const giftColor = '#eaa340'

export function FamilyNodeOrbit({
  nodes = [
    { id: 'note', kind: 'family_note' },
    { id: 'gift', kind: 'family_gift' },
  ],
}: FamilyNodeOrbitProps) {
  return (
    <div
      className={styles.orbit}
      style={{ ['--note-color' as string]: noteColor, ['--gift-color' as string]: giftColor }}
      aria-hidden="true"
    >
      <div className={styles.core} />
      {nodes.map((node, index) => (
        <span
          key={node.id}
          className={styles.node}
          data-kind={node.kind}
          style={{ ['--node-index' as string]: index }}
        />
      ))}
    </div>
  )
}
