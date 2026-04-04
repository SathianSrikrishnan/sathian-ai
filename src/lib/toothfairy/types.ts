/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/toothfairy_escrow.json`.
 */
export type ToothfairyEscrow = {
  "address": "FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC",
  "metadata": {
    "name": "toothfairyEscrow",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Tooth Fairy Network — Soulbound NFT milestones with escrow deposits on Solana"
  },
  "instructions": [
    {
      "name": "claimMilestone",
      "docs": [
        "Claim a milestone — transfers escrowed SOL to the child's wallet.",
        "Only the guardian can trigger this (parental control)."
      ],
      "discriminator": [
        211,
        134,
        152,
        37,
        3,
        82,
        214,
        189
      ],
      "accounts": [
        {
          "name": "guardian",
          "writable": true,
          "signer": true,
          "relations": [
            "childProfile"
          ]
        },
        {
          "name": "childProfile",
          "writable": true
        },
        {
          "name": "milestone",
          "writable": true
        },
        {
          "name": "childWallet",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "getMilestones",
      "docs": [
        "Get all milestones for a child (read-only — clients use getProgramAccounts).",
        "This instruction is a no-op that exists for documentation.",
        "In practice, frontends query milestones via getProgramAccounts with filters."
      ],
      "discriminator": [
        165,
        160,
        57,
        38,
        83,
        149,
        71,
        26
      ],
      "accounts": [
        {
          "name": "childProfile"
        }
      ],
      "args": []
    },
    {
      "name": "initializeChild",
      "docs": [
        "Initialize a new child profile that tracks milestones.",
        "Called once per child by the parent (guardian)."
      ],
      "discriminator": [
        247,
        62,
        145,
        15,
        249,
        58,
        239,
        188
      ],
      "accounts": [
        {
          "name": "guardian",
          "writable": true,
          "signer": true
        },
        {
          "name": "childWallet"
        },
        {
          "name": "childProfile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  104,
                  105,
                  108,
                  100,
                  95,
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "guardian"
              },
              {
                "kind": "account",
                "path": "childWallet"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "childName",
          "type": "string"
        }
      ]
    },
    {
      "name": "logMilestone",
      "docs": [
        "Log a new tooth milestone — mints an NFT and optionally escrows SOL.",
        "Only the guardian (parent) can call this."
      ],
      "discriminator": [
        98,
        62,
        190,
        133,
        213,
        240,
        225,
        247
      ],
      "accounts": [
        {
          "name": "guardian",
          "writable": true,
          "signer": true,
          "relations": [
            "childProfile"
          ]
        },
        {
          "name": "childProfile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  104,
                  105,
                  108,
                  100,
                  95,
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "guardian"
              },
              {
                "kind": "account",
                "path": "child_profile.child_wallet",
                "account": "childProfile"
              }
            ]
          }
        },
        {
          "name": "milestone",
          "writable": true
        },
        {
          "name": "nftMint",
          "docs": [
            "The NFT mint account (created by client, passed in)"
          ],
          "writable": true
        },
        {
          "name": "guardianNftAccount",
          "docs": [
            "The guardian's associated token account for the NFT"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "guardian"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "nftMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "metadataAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "tokenMetadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        }
      ],
      "args": [
        {
          "name": "toothType",
          "type": {
            "defined": {
              "name": "toothType"
            }
          }
        },
        {
          "name": "metadataUri",
          "type": "string"
        },
        {
          "name": "depositLamports",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "childProfile",
      "discriminator": [
        168,
        83,
        135,
        85,
        134,
        176,
        213,
        191
      ]
    },
    {
      "name": "milestone",
      "discriminator": [
        38,
        210,
        239,
        177,
        85,
        184,
        10,
        44
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "nameTooLong",
      "msg": "Child name must be 32 characters or fewer"
    },
    {
      "code": 6001,
      "name": "maxMilestonesReached",
      "msg": "Maximum of 20 milestones per child"
    },
    {
      "code": 6002,
      "name": "alreadyClaimed",
      "msg": "This milestone has already been claimed"
    },
    {
      "code": 6003,
      "name": "nothingToClaim",
      "msg": "No deposit to claim"
    },
    {
      "code": 6004,
      "name": "wrongChildWallet",
      "msg": "Child wallet does not match profile"
    },
    {
      "code": 6005,
      "name": "duplicateToothType",
      "msg": "This tooth type has already been recorded"
    }
  ],
  "types": [
    {
      "name": "childProfile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "guardian",
            "type": "pubkey"
          },
          {
            "name": "childWallet",
            "type": "pubkey"
          },
          {
            "name": "childName",
            "type": "string"
          },
          {
            "name": "milestoneCount",
            "type": "u8"
          },
          {
            "name": "totalDeposited",
            "type": "u64"
          },
          {
            "name": "totalClaimed",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "milestone",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "childProfile",
            "type": "pubkey"
          },
          {
            "name": "toothType",
            "type": {
              "defined": {
                "name": "toothType"
              }
            }
          },
          {
            "name": "metadataUri",
            "type": "string"
          },
          {
            "name": "depositLamports",
            "type": "u64"
          },
          {
            "name": "claimed",
            "type": "bool"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "claimedAt",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "milestoneIndex",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "toothType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "upperRightCentralIncisor"
          },
          {
            "name": "upperLeftCentralIncisor"
          },
          {
            "name": "lowerRightCentralIncisor"
          },
          {
            "name": "lowerLeftCentralIncisor"
          },
          {
            "name": "upperRightLateralIncisor"
          },
          {
            "name": "upperLeftLateralIncisor"
          },
          {
            "name": "lowerRightLateralIncisor"
          },
          {
            "name": "lowerLeftLateralIncisor"
          },
          {
            "name": "upperRightCanine"
          },
          {
            "name": "upperLeftCanine"
          },
          {
            "name": "lowerRightCanine"
          },
          {
            "name": "lowerLeftCanine"
          },
          {
            "name": "upperRightFirstMolar"
          },
          {
            "name": "upperLeftFirstMolar"
          },
          {
            "name": "lowerRightFirstMolar"
          },
          {
            "name": "lowerLeftFirstMolar"
          },
          {
            "name": "upperRightSecondMolar"
          },
          {
            "name": "upperLeftSecondMolar"
          },
          {
            "name": "lowerRightSecondMolar"
          },
          {
            "name": "lowerLeftSecondMolar"
          }
        ]
      }
    }
  ]
};
