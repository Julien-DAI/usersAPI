export interface Round {
    id: number
    match_id: number
    creature1_id: number | null
    creature2_id: number | null
    creature_winner: number | null
    round_number: number
    status: number
}