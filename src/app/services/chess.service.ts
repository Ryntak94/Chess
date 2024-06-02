import { Injectable } from '@angular/core';
import { Square } from '../types/square';
import { Piece } from '../types/piece';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class ChessService {

  constructor() { }

  public isMoveValid(originSquare: Square, destinationSquare: Square, rows: Array<Array<{piece: Piece, icon: IconDefinition} | null>>, currentTurn: "black" | "white"): boolean {
    if(originSquare.piece?.color !== currentTurn) return false;
    if(originSquare.piece?.color === destinationSquare?.piece?.color) return false;
    if(!this.legalMoveForPiece(originSquare, destinationSquare, rows)) return false;
    return true
  }
  
  private legalMoveForPiece(originSquare: Square, destinationSquare: Square, rows: Array<Array<{piece: Piece, icon: IconDefinition} | null>>): boolean {
    if(originSquare.piece?.name === 'chess-pawn') {
      return this.legalMoveForPawn(originSquare, destinationSquare, rows);
    }
    if(originSquare.piece?.name === 'chess-rook') {
      return this.legalMoveForRook(originSquare, destinationSquare, rows);
    }
    if(originSquare.piece?.name === 'chess-knight') {
      return this.legalMoveForKnight(originSquare, destinationSquare);
    }
    if(originSquare.piece?.name === 'chess-bishop') {
      return this.legalMoveForBishop(originSquare, destinationSquare, rows);
    }
    return true
  }

  private legalMoveForPawn(originSquare: Square, destinationSquare: Square, rows: Array<Array<{piece: Piece, icon: IconDefinition} | null>>): boolean {
    if(originSquare.piece?.color === 'white') {
      if(this.getRankDifference(originSquare, destinationSquare) === -1 && this.getFileDifference(originSquare, destinationSquare) === 0 && destinationSquare.piece === null) {
        return true
      }
      if(this.getRankDifference(originSquare, destinationSquare) === -1 && Math.abs(this.getFileDifference(originSquare, destinationSquare)) === 1 && destinationSquare.piece?.color === 'black') {
        return true
      }
      if(originSquare.rank === 2 && this.getRankDifference(originSquare, destinationSquare) === -2 && this.getFileDifference(originSquare, destinationSquare) === 0 && destinationSquare.piece === null && (!rows[originSquare.row - 1][originSquare.col]?.piece)) {
        return true
      }
    }
    if(originSquare.piece?.color === 'black') {
      if(this.getRankDifference(originSquare, destinationSquare) === 1 && this.getFileDifference(originSquare, destinationSquare) === 0 && destinationSquare.piece === null) {
        return true
      }

      if(this.getRankDifference(originSquare, destinationSquare) === 1 && Math.abs(this.getFileDifference(originSquare, destinationSquare)) === 1 && destinationSquare.piece?.color === 'white') {
        return true
      }
      if(originSquare.rank === 7 && this.getRankDifference(originSquare, destinationSquare) === 2 && this.getFileDifference(originSquare, destinationSquare) === 0 && destinationSquare.piece === null && (!rows[originSquare.row + 1][originSquare.col]?.piece)) {
        return true
      }
    }
    return false
  }

  private legalMoveForRook(originSquare: Square, destinationSquare: Square, rows: Array<Array<{piece: Piece, icon: IconDefinition} | null>>): boolean {
    if(originSquare.rank !== destinationSquare.rank && originSquare.file !== destinationSquare.file) return false
    const rankDifference = this.getRankDifference(originSquare, destinationSquare) 
    const fileDifference = this.getFileDifference(originSquare, destinationSquare)
    console.log(rankDifference, fileDifference)
    if(rankDifference === 0) {
      if(fileDifference < 0) {
        for(let i: number = 0; i > Math.abs(fileDifference); i++) {
          if(rows[originSquare.row][originSquare.col + i + 1] === null)return false
        }
      } else {
        for(let i: number = 0; i < fileDifference; i++) {
          if(rows[originSquare.row][originSquare.col - i - 1] === null) return false
        }
      }
    }
    if(fileDifference === 0) {
      if(rankDifference < 0) {
        for(let i: number = 0; i < rankDifference - 1; i++) {
          if(rows[originSquare.row - i - 1][originSquare.col] === null) return false
        }
      } else {
        for(let i: number = 0; i < rankDifference; i++) {
          if(rows[originSquare.row + i + 1][originSquare.col] === null) return false
        }
      }
    }
    return true
  }

  private legalMoveForKnight(originSquare: Square, destinationSquare: Square): boolean {
    if(Math.abs(this.getRankDifference(originSquare, destinationSquare)) === 1 && Math.abs(this.getFileDifference(originSquare, destinationSquare)) === 2) return true;
    if(Math.abs(this.getRankDifference(originSquare, destinationSquare)) === 2 && Math.abs(this.getFileDifference(originSquare, destinationSquare)) === 1) return true;
    return false;
  }

  private legalMoveForBishop(originSquare: Square, destinationSquare: Square, rows: Array<Array<{piece: Piece, icon: IconDefinition} | null>>): boolean {
    return true;
  }

  private getRankDifference(originSquare: Square, destinationSquare: Square): number {
    return originSquare.rank - destinationSquare.rank
  }

  private getFileDifference(originSquare: Square, destinationSquare: Square): number {
    const fileMap = new Map<string, number>([["A",0],["B",1],["C",2],["D",3],["E",4],["F",5],["G",6],["H",7]])
    const originFile = fileMap.get(originSquare.file) as number
    const destinationFile = fileMap.get(destinationSquare.file) as number
    return originFile - destinationFile
  }
  
}
