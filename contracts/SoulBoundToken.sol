// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "./structs.sol";

contract SoulBoundToken is ERC721, Ownable {
    // Address of the owner
    address private _owner;

    // Mapping to store token data
    mapping(uint256 => TokenData) private _tokenData;

    // Token ID counter
    uint256 private _tokenIdCounter;

    // Event emitted when a token is minted
    event MintEvent(uint256 tokenId, bytes32 hash);

    constructor() ERC721("soulBoundToken", "SBT") Ownable(msg.sender) {
        _tokenIdCounter = 0;
    }

    // Function to create a new SBT
    function mint(
        string memory name,
        string memory description,
        string memory ipfsHash,
        string memory university,
        string memory career,
        string memory certifyingEntity,
        string memory certificateType,
        uint256 issueDate
    ) external onlyOwner {
        uint256 tokenId = _tokenIdCounter++;
        _mint(msg.sender, tokenId);
        _tokenData[tokenId] = TokenData(
            name,
            description,
            ipfsHash,
            university,
            career,
            certifyingEntity,
            certificateType,
            issueDate
        );

        bytes32 calculatedHash = keccak256(abi.encode(bytes1(0x19)));
        calculatedHash = keccak256(
            abi.encode(
                calculatedHash,
                name,
                description,
                ipfsHash,
                university,
                career,
                certifyingEntity,
                certificateType,
                issueDate
            )
        );
        emit MintEvent(tokenId, calculatedHash);
    }

    // Function to check if a token exists
    function _exists(uint256 tokenId) internal view returns (bool) {
        return (tokenId < _tokenIdCounter);
    }

    // Function to retrieve token metadata
    function getTokenData(
        uint256 tokenId
    ) external view returns (TokenData memory) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenData[tokenId];
    }

    // Override with empty implementation.
    function approve(address to, uint256 tokenId) public override {
        revert("SoulBound Token: Operation not supported");
    }

    // Override with empty implementation.
    function getApproved(
        uint256 tokenId
    ) public view override returns (address) {
        revert("SoulBound Token cannot be transferred");
    }

    // Override with empty implementation.
    function setApprovalForAll(
        address operator,
        bool approved
    ) public pure override {
        revert("SoulBound Token cannot be transferred");
    }

    // Override with empty implementation.
    function isApprovedForAll(
        address owner,
        address operator
    ) public view override returns (bool) {
        revert("SoulBound Token cannot be transferred");
    }

    // Override to prevent the transfer of SBT
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        revert("SoulBound Token cannot be transferred");
    }

    // Override to prevent the transfer of SBT
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public virtual override {
        revert("SoulBound Token cannot be transferred");
    }
}
