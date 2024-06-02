import { Component } from '@angular/core';
import { faChessKnight, faChessRook, faChessBishop, faChessKing, faChessQueen, faChessPawn, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ChessService } from 'src/app/services/chess.service';
import { Rank } from 'src/app/types/rank';
import { File } from 'src/app/types/file';
import { Square } from 'src/app/types/square';
import { Piece } from 'src/app/types/piece';

@Component({
  selector: 'chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.sass']
})
export class ChessBoardComponent {
  public rows: Array<Array<{piece: Piece, icon: IconDefinition} | null>> = Array(8).fill(Array(8).fill(null));
  public originSquare: { row: number, col: number } | null = null;
  public currentTurn: "black" | "white" = "white";
  faChessKnight = faChessKnight;
  faChessRook = faChessRook;
  faChessBishop = faChessBishop;
  faChessKing = faChessKing;
  faChessQueen = faChessQueen;
  faChessPawn = faChessPawn;
  constructor(private readonly ChessService: ChessService) {
    this.setInitialBoard()

  }

  public onDrag(row: number, col: number) {
    this.originSquare = { row, col };
  }

  public onDropHandler(row: number, col: number) {
    const validCoords = this.idxToCoordinate(row, col)
    if(validCoords === null) return
    this.updateBoard(row, col);
  }
  public onDragOverEnterHandler(event: any) {
    event.preventDefault();
  }
  private setInitialBoard() {
    this.rows = this.rows.map((row, i) => row.map((_: any, j: number) => {
      if (i === 1) {
        return {piece: { name: "chess-pawn", color: 'black' }, icon: faChessPawn };
      } else if (i === 6) {

        return {piece: { name: "chess-pawn", color: 'white' }, icon: faChessPawn };

      } else if (i === 0) {
        if (j === 0 || j === 7) {

        return {piece: { name: "chess-rook", color: 'black' }, icon: faChessRook };

        } else if (j === 1 || j === 6) {
        return {piece: { name: "chess-knight", color: 'black' }, icon: faChessKnight };
        } else if (j === 2 || j === 5) {
        return {piece: { name: "chess-bishop", color: 'black' }, icon: faChessBishop };
        } else if (j === 3) {
        return {piece: { name: "chess-queen", color: 'black' }, icon: faChessQueen };
        } else if (j === 4) {
        return {piece: { name: "chess-king", color: 'black' }, icon: faChessKing };
        }
      } else if (i === 7) {
        if (j === 0 || j === 7) {
        return {piece: { name: "chess-rook", color: 'white' }, icon: faChessRook };
        } else if (j === 1 || j === 6) {
        return {piece: { name: "chess-knight", color: 'white' }, icon: faChessKnight };
        } else if (j === 2 || j === 5) {
        return {piece: { name: "chess-bishop", color: 'white' }, icon: faChessBishop };
        } else if (j === 3) {
        return {piece: { name: "chess-queen", color: 'white' }, icon: faChessQueen };
        } else if (j === 4) {
        return {piece: { name: "chess-king", color: 'white' }, icon: faChessKing };
        }
      }
      return null;
    })) as Array<Array<{piece: Piece, icon: IconDefinition} | null>>;
  }

  private updateBoard(row: number, col: number) {
    if(this.originSquare === null) return
    const oldRow = this.originSquare.row;
    const oldCol = this.originSquare.col;
    const originSquare: Square = this.getSquare(oldRow, oldCol)
    const destinationSquare: Square = this.getSquare(row, col)

    if(this.ChessService.isMoveValid(originSquare, destinationSquare, this.rows, this.currentTurn) === false) return

    this.rows[row][col] = this.rows[oldRow][oldCol];
    this.rows[oldRow][oldCol] = null
    this.resetForNextTurn()
  }
  private resetForNextTurn() {
    this.currentTurn = this.currentTurn === "black" ? "white" : "black"
    this.originSquare = null;
  }

  private getSquare(row: number, col: number): Square {
    const coordinates = this.idxToCoordinate(row, col);
    if(coordinates === null) {
      throw new Error("Invalid coordinates")
    }
    const piece = this.rows[row][col]?.piece ?? null
    const square: Square = { ...coordinates,  piece, row, col}
    return square
  }

  private idxToCoordinate(row: number, col: number): { rank: Rank, file: File } | null {
    const rankMap = new Map<number, Rank>([[0, 8], [1, 7], [2, 6], [3, 5], [4, 4], [5, 3], [6, 2], [7, 1]])
    const fileMap = new Map<number, string>([[0, "A"], [1, "B"], [2, "C"], [3, "D"], [4, "E"], [5, "F"], [6, "G"], [7, "H"]])
    const rank = rankMap.get(row) as Rank | undefined
    const file = fileMap.get(col) as File | undefined
    if(rank === undefined) {
      return null
    }
    if(file === undefined) {
      return null
    }
    return { rank, file }
  }
}

