import { Piece } from "./piece";
import { Rank } from "./rank";
import { File } from "./file";

export interface Square {
    rank: Rank;
    file: File;
    row: number;
    col: number;
    piece: Piece | null;
}
