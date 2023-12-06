export interface Match {
    id: number
    match_id: number
    player1_id: number
    player2_id: number
    winner: number | null
    status: boolean
    rounds: number[]
}
