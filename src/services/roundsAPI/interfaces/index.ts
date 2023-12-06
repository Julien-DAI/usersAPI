export interface Round {
    id: number
    creature1_id: number | null
    creature2_id: number | null
    crature_winner: number | null
    round_number: number
    status: boolean
}